import * as docdb from 'aws-cdk-lib/aws-docdb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { DocumentDBProps } from './props/documentdb.props';
import { createName } from '../../utils/create-name';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { createOutput } from '../../utils/create-output';

export class DocumentDB extends Construct {
  databaseCluster: docdb.DatabaseCluster;

  constructor(scope: Construct, id: string, documentDBProps: DocumentDBProps) {
    super(scope, id);

    // get vpc and security group
    const { securityGroup, vpc } = documentDBProps;

    const DATABASE_PARAMETER_GROUP_NAME = createName(
      'parameter-group',
      documentDBProps,
    );
    const parameterGroup = new docdb.ClusterParameterGroup(
      this,
      DATABASE_PARAMETER_GROUP_NAME,
      {
        family: 'docdb5.0',
        parameters: {
          tls: 'enabled',
        },
      },
    );

    // create a document db cluster
    const DATABASE_CLUSTER_NAME = createName('cluster', documentDBProps);

    this.databaseCluster = new docdb.DatabaseCluster(
      this,
      DATABASE_CLUSTER_NAME,
      {
        dbClusterName: DATABASE_CLUSTER_NAME,
        masterUser: {
          username: 'application',
        },
        parameterGroup,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T4G,
          ec2.InstanceSize.MEDIUM,
        ),
        engineVersion: '5.0.0',
        storageEncrypted: true,
        vpc,
        vpcSubnets: vpc.selectSubnets({
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        }),
        securityGroup: securityGroup,
      },
    );
    this.databaseCluster.connections.allowDefaultPortFromAnyIpv4();
    // add rotation of secret
    this.databaseCluster.addRotationSingleUser();

    //export document db output
    this.exportDocumentDB('cluster', documentDBProps);
  }

  exportDocumentDB(scopedName: string, props) {
    // create name scoped
    const createNameScoped = (name, config) =>
      createName(`${scopedName}-${name}`, config);

    // outputs
    createOutput(
      this,
      createNameScoped('secret-name', props),
      this.databaseCluster.secret.secretName,
    );
  }
}
