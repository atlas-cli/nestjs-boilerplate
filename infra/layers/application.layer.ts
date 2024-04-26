import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { CnameRecord, PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { ApiGateway } from '../constructs/api-gateway/api-gateway.construct';
import {
  ApplicationProps,
  IApplicationResource,
} from '../props/application.props';
import { DatabaseMigrationResource } from '../resources/database-migration.resource';
import { LambdaResource } from '../resources/lambda.resources';
import { createSessionsTable } from '../tables/sessions';
import { createName } from '../utils/create-name';
import { GenericSecurityGroup } from '../constructs/generic-security-group/generic-security-group.construct';
import { Port } from 'aws-cdk-lib/aws-ec2';

export class ApplicationLayerStack extends cdk.Stack {
  databaseMigrationResource: DatabaseMigrationResource;
  lambdaResource: LambdaResource;
  certificate: Certificate;

  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id, applicationProps);

    // application for run database migration
    const DATABASE_MIGRATION_NAME = createName(
      'aurora-database',
      applicationProps,
    );
    this.databaseMigrationResource = new DatabaseMigrationResource(
      this,
      DATABASE_MIGRATION_NAME,
      applicationProps,
    );

    const API_GATEWAY_FUNCTION_NAME = createName(
      'api-gateway',
      applicationProps,
    );
    const publicHostedZone = PublicHostedZone.fromHostedZoneAttributes(
      this,
      'Zone',
      {
        hostedZoneId: applicationProps.idPublicHostZone,
        zoneName: applicationProps.domainName,
      },
    );
    const certificate = new Certificate(this, 'Certificate', {
      domainName: applicationProps.domainName,
      subjectAlternativeNames: [
        '*.' + applicationProps.domainName,
        applicationProps.domainName,
      ],
      validation: CertificateValidation.fromDns(publicHostedZone),
    });
    this.certificate = certificate;

    // Tables
    const sessions = createSessionsTable(this, applicationProps);

    const { api } = new ApiGateway(this, API_GATEWAY_FUNCTION_NAME, {
      ...applicationProps,
      restApiName: 'api',
      domainName: applicationProps.apiDomainName,
      certificate: certificate,
    });

    // Security Group
    const { vpc, securityGroup: databaseProxySecurityGroup } = GenericSecurityGroup.fromName(
      this,
      'database-proxy-sg',
      applicationProps,
    );

    //Lambda SG
    const lambdaSecurityGroup = new GenericSecurityGroup(
      this,
      createName('lambda-sg', applicationProps),
      {
        name: 'lambda-sg',
        vpc,
        ...applicationProps,
      },
    );

    // Lambda access to proxy
    databaseProxySecurityGroup.addIngressRule(lambdaSecurityGroup.securityGroup, Port.tcp(5432), `Allows access from the migrations lambda to the proxy`);

    this.createLambdaResources(
      this,
      applicationProps,
      api,
      {
        sessions,
      },
      [
        { functionName: 'auth', moduleName: 'auth' },
        { functionName: 'users', moduleName: 'users' },
        {
          functionName: 'swagger',
          moduleName: 'swagger',
          swaggerBundling: true,
        },
      ],
      lambdaSecurityGroup,
    );

    // Finally, add a CName record in the hosted zone with a value of the new custom domain that was created above:
    const CNAME_RECORD_SET_NAME = createName(
      'api-gateway-cname-record-set',
      applicationProps,
    );
    new CnameRecord(this, CNAME_RECORD_SET_NAME, {
      zone: publicHostedZone,
      recordName: 'api',
      domainName: api.domainName.domainNameAliasDomainName
    });
  }

  createLambdaResources(
    scope: Construct,
    applicationProps: ApplicationProps,
    api: any,
    tables: { sessions: Table },
    resources: IApplicationResource[],
    genericSecurityGroup: GenericSecurityGroup,
  ): void {
    resources.forEach(({ functionName, moduleName, swaggerBundling }) => {
      const lambdaName = createName(functionName, applicationProps);
      const lambdaResource = new LambdaResource(scope, lambdaName, {
        functionName,
        moduleName,
        swaggerBundling,
        genericSecurityGroup,
        ...applicationProps,
      });
      Object.keys(tables).forEach((key) =>
        tables[key].grantReadWriteData(lambdaResource.nodejsFunction),
      );

      const integration = new LambdaIntegration(lambdaResource.nodejsFunction, {
        proxy: true,
      });

      const resource = api.root.addResource(moduleName);
      resource.addResource('{proxy+}').addMethod('ANY', integration);
      resource.addMethod('ANY', integration);
    });
  }
}
