import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ApplicationProps } from '../props/application-props';

export class PipelineRoleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props);

    if (props.githubOrganizationId === undefined) {
      throw new Error(
        'You need add githubOrganizationId in your application props on configs/.',
      );
    }
    
    // Define o provedor OpenID Connect
    const organizationId = props.githubOrganizationId;
    const providerUrl = `https://oidc.circleci.com/org/${organizationId}`;
    const provider = new iam.OpenIdConnectProvider(
      this,
      'PipelineOidcProvider',
      {
        url: providerUrl,
        clientIds: [organizationId],
      },
    );

    // Define a role
    const pipelineRole = new iam.Role(this, 'PipelineRole', {
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {},
        'sts:AssumeRoleWithWebIdentity',
      ),
      description: 'Role for ECS update and ECR push permissions',
    });

    const account = props.env.account;
    const region = props.env.region;

    // Attach policies to allow ECS task execution and image push
    pipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'ecs:UpdateService',
          'iam:PassRole',
          'ecs:RegisterTaskDefinition',
          'ecs:ListTaskDefinitions',
          'ecs:DescribeTaskDefinition',
          'ecs:DescribeServices',
          'ecs:ListClusters',
          'ecs:ListServices',
          'ecr:GetDownloadUrlForLayer',
          'ecr:GetAuthorizationToken',
          'ecr:BatchGetImage',
          'ecr:BatchCheckLayerAvailability',
          'ecr:CompleteLayerUpload',
          'ecr:UploadLayerPart',
          'ecr:InitiateLayerUpload',
          'ecr:PutImage',
          'ecs:TagResource', // Adicionada a permissão ecs:TagResource
        ],
        resources: [
          `arn:aws:ecs:${region}:${account}:service/*`,
          `arn:aws:ecs:${region}:${account}:task-definition/*`,
          `arn:aws:ecs:${region}:${account}:cluster/*`,
          `arn:aws:ecr:${region}:${account}:repository/*`,
        ],
      }),
    );

    // Add the new policy statement to allow ecr:GetAuthorizationToken
    pipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ecr:GetAuthorizationToken'],
        resources: [`arn:aws:ecr:${region}:${account}:repository/*`],
      }),
    );

    // Add policies to allow tunneling to the database via SSM
    pipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'ssm:StartSession',
          'ssm:SendCommand',
          'ssm:DescribeInstanceInformation',
          'ssm:GetCommandInvocation',
          'ssm:ListCommands',
          'ssm:ListCommandInvocations',
          'ssm:TerminateSession',
        ],
        resources: [`arn:aws:ssm:${region}:${account}:*`],
      }),
    );

    pipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'ec2:DescribeInstances',
          'ec2:DescribeRegions',
          'ec2:DescribeSecurityGroups',
          'ec2:DescribeSubnets',
          'ec2:DescribeVpcs',
          'rds:DescribeDBInstances',
          'rds:DescribeDBClusters',
        ],
        resources: [`arn:aws:ec2:${region}:${account}:*`, `arn:aws:rds:${region}:${account}:*`],
      }),
    );

    // Add policies to allow access to AWS Secrets Manager
    pipelineRole.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
        ],
        resources: [`arn:aws:secretsmanager:${region}:${account}:secret:*`],
      }),
    );

    // Create a user
    const pipelineUser = new iam.User(this, 'PipelineUser', {
      userName: 'PipelineUser',
    });

    // Attach inline policy to allow the user to assume the role
    pipelineUser.addToPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [pipelineRole.roleArn],
      }),
    );

    // Output the user name
    new cdk.CfnOutput(this, 'PipelineUserName', {
      value: pipelineUser.userName,
      description: 'User name for the pipeline user',
    });

    // Output the role ARN
    new cdk.CfnOutput(this, 'PipelineRoleArn', {
      value: pipelineRole.roleArn,
      description: 'ARN of the role used by the pipeline',
    });

    // Output the OIDC provider ARN
    new cdk.CfnOutput(this, 'OpenIdConnectProviderArn', {
      value: provider.openIdConnectProviderArn,
      description: 'ARN of the OIDC provider',
    });
  }
}
