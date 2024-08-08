import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationConfig,
  ApplicationProps,
} from '../props/application-props';
import { importGenericSecurityGroupResources } from '../helpers/setup-generic-security-group';
import { LambdaNestJsFunctionProps } from '../constructs/lambda-nestjs-function/props/lambda-nestjs-function.props';
import { LambdaNestJsFunction } from '../constructs/lambda-nestjs-function/lambda-nestjs-function.construct';
import {
  AnyPrincipal,
  ManagedPolicy,
  PolicyStatement,
  Role,
} from 'aws-cdk-lib/aws-iam';
import { CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';

export class ApplicationStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id);

    const applicationConfig = applicationProps.applications.core;

    const publicHostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(
      this,
      'ApplicationZone',
      {
        hostedZoneId: applicationConfig.idPublicHostZone,
        zoneName: applicationConfig.domainName,
      },
    );

    const certificate = new certificatemanager.Certificate(
      this,
      'ApplicationCertificate',
      {
        domainName: applicationConfig.domainName,
        subjectAlternativeNames: [
          `*.${applicationConfig.domainName}`,
          applicationConfig.domainName,
        ],
        validation:
          certificatemanager.CertificateValidation.fromDns(publicHostedZone),
      },
    );

    const api = new apigateway.RestApi(this, 'ApplicationApiGateway', {
      restApiName: 'api',
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ['*'],
      },
      domainName: {
        domainName: applicationConfig.apiDomainName,
        certificate: certificate,
      },
    });

    // Import a VPC from database
    const { vpc } = importGenericSecurityGroupResources(
      this,
      'CoreDatabaseSecurityGroup',
    );

    const lambdaSecurityGroup = new ec2.SecurityGroup(
      this,
      'LambdaSecurityGroup',
      {
        vpc,
        allowAllOutbound: true,
      },
    );

    const sessionsTable = new dynamodb.Table(this, 'SessionsTable', {
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const secretsManagerPolicy = new PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: ['*'],
    });

    const dataApiPolicy = new PolicyStatement({
      actions: [
        'rds-data:BatchExecuteStatement',
        'rds-data:BeginTransaction',
        'rds-data:CommitTransaction',
        'rds-data:ExecuteStatement',
        'rds-data:RollbackTransaction',
      ],
      resources: ['*'],
    });

    const lambdaRole = new Role(this, 'LambdaRole', {
      roleName: 'LambdaRole',
      assumedBy: new AnyPrincipal(),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaVPCAccessExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        ManagedPolicy.fromAwsManagedPolicyName('SecretsManagerReadWrite'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSESFullAccess'),
      ],
    });
    lambdaRole.addToPolicy(secretsManagerPolicy);
    lambdaRole.addToPolicy(dataApiPolicy);

    this.createLambdaResources(
      applicationConfig,
      applicationProps,
      api,
      { sessions: sessionsTable },
      [
        { functionName: 'Auth', moduleName: 'auth' },
        { functionName: 'Users', moduleName: 'users' },
        {
          functionName: 'Swagger',
          moduleName: 'swagger',
          swaggerBundling: true,
        },
      ],
      vpc,
      lambdaSecurityGroup,
      lambdaRole,
    );

    new route53.CnameRecord(this, 'ApiGatewayCnameRecord', {
      zone: publicHostedZone,
      recordName: 'api',
      domainName: api.domainName?.domainNameAliasDomainName ?? '',
    });
  }

  createLambdaResources(
    applicationConfig: ApplicationConfig<any>,
    applicationProps: ApplicationProps,
    api: apigateway.RestApi,
    tables: { sessions: dynamodb.Table },
    resources: {
      functionName: string;
      moduleName: string;
      swaggerBundling?: boolean;
    }[],
    vpc: ec2.IVpc,
    securityGroup: ec2.SecurityGroup,
    lambdaRole: Role,
  ) {
    resources.forEach(({ functionName, moduleName, swaggerBundling }) => {
      const lambdaFunctionProps: LambdaNestJsFunctionProps = {
        functionName: applicationProps.applicationName + functionName,
        moduleName,
        environment: {
          ...applicationConfig.applicationEnvironment,
          TABLE_NAME: tables.sessions.tableName,
        },
        role: lambdaRole,
        vpc,
        securityGroup,
        swaggerBundling,
      };

      const { nodejsFunction } = new LambdaNestJsFunction(
        this,
        `${functionName}Function`,
        lambdaFunctionProps,
      );

      tables.sessions.grantReadWriteData(nodejsFunction);

      const lambdaIntegration = new apigateway.LambdaIntegration(
        nodejsFunction,
        {
          proxy: true,
        },
      );

      const resource = api.root.addResource(moduleName);
      resource.addResource('{proxy+}').addMethod('ANY', lambdaIntegration);
      resource.addMethod('ANY', lambdaIntegration);
    });
  }
}
