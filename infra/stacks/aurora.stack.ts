import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import {
  InstanceType,
  SecurityGroup,
  SubnetType,
  Vpc,
  Peer,
  Port
} from 'aws-cdk-lib/aws-ec2';
import { Aspects, CfnOutput, } from 'aws-cdk-lib';
import { CfnDBCluster } from 'aws-cdk-lib/aws-rds';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class AuroraServerlessV2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, { stage }: any) {
    super(scope, id,);
    const name = 'aurora-' + stage;


    // create a vpc
    const vpc = new Vpc(this, name + '-Vpc', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [{ name: 'egress', subnetType: SubnetType.PUBLIC }], // only one subnet is needed
      natGateways: 0 // disable NAT gateways
    });

    // create a security group for aurora db
    const dbSecurityGroup = new SecurityGroup(this, name + '-DbSecurityGroup', {
      vpc: vpc, // use the vpc created above
      allowAllOutbound: true // allow outbound traffic to anywhere
    });

    // allow inbound traffic from anywhere to the db
    dbSecurityGroup.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(5432), // allow inbound traffic on port 5432 (postgres)
      'allow inbound traffic from anywhere to the db on port 5432'
    );

    // create a db cluster
    // https://github.com/aws/aws-cdk/issues/20197#issuecomment-1117555047
    const dbCluster = new rds.DatabaseCluster(this, name + '-DbCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_6
      }),
      instances: 1,
      iamAuthentication: true,
      instanceProps: {
        vpc: vpc,
        instanceType: new InstanceType('serverless'),
        autoMinorVersionUpgrade: true,
        publiclyAccessible: true,
        securityGroups: [dbSecurityGroup],
        vpcSubnets: vpc.selectSubnets({
          subnetType: SubnetType.PUBLIC // use the public subnet created above for the db
        })
      },
      port: 5432 // use port 5432 instead of 3306
    });

    const proxy = new rds.DatabaseProxy(this, 'Proxy', {
      proxyTarget: rds.ProxyTarget.fromCluster(dbCluster),
      secrets: [dbCluster.secret!],
      vpc,
      securityGroups: [dbSecurityGroup],
      iamAuth: true,
    });

    const role = new iam.Role(this, 'DBProxyRole', {
      assumedBy: new iam.AnyPrincipal,
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"),
        ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole")
      ]
    });
    proxy.grantConnect(role, 'postgres');
    // add capacity to the db cluster to enable scaling
    Aspects.of(dbCluster).add({
      visit(node) {
        if (node instanceof CfnDBCluster) {
          node.serverlessV2ScalingConfiguration = {
            minCapacity: 0.5, // min capacity is 0.5 vCPU
            maxCapacity: 1 // max capacity is 1 vCPU (default)
          };
        }
      }
    });
    new CfnOutput(this, 'DatabaseVpcId', {
      value: vpc.vpcId,
      exportName: name + '-vpc-id',
    });
    new CfnOutput(this, 'DatabaseSubnetId1', {
      value: vpc.publicSubnets[0].subnetId,
      exportName: name + '-subnet-id-1',
    });
    new CfnOutput(this, 'DatabaseSubnetId2', {
      value: vpc.publicSubnets[1].subnetId,
      exportName: name + '-subnet-id-2',
    });
    new CfnOutput(this, 'DatabaseSecurityGroup', {
      value: dbSecurityGroup.securityGroupId,
      exportName: name + '-security-group-id',
    });
    new CfnOutput(this, 'AuroraStackHost', {
      value: proxy.endpoint,
      exportName: name + '-host',
    });
    new CfnOutput(this, 'AuroraStackRole', {
      value: role.roleArn,
      exportName: name + '-role',
    });
  }
}