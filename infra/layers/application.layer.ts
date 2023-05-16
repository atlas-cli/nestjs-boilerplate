import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGateway } from '../constructs/api-gateway/api-gateway.construct';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { ApplicationProps } from '../props/application.props';
import { createName } from '../utils/create-name';
import { LambdaResource } from '../resources/lambda.resource';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

export class ApplicationLayerStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps,
  ) {
    super(scope, id, applicationProps);

    const API_GATEWAY_FUNCTION_NAME = createName(
      'api-gateway',
      applicationProps,
    );

    const certificate = new Certificate(this, 'Certificate', {
      domainName: applicationProps.domainName,
      subjectAlternativeNames: [
        '*.' + applicationProps.domainName,
        applicationProps.domainName,
      ],
      validation: CertificateValidation.fromDns(
        PublicHostedZone.fromHostedZoneId(
          this,
          'Zone',
          applicationProps.idPublicHostZone,
        ),
      ),
    });
    const { api } = new ApiGateway(this, API_GATEWAY_FUNCTION_NAME, {
      ...applicationProps,
      restApiName: 'api',
      domainName: applicationProps.domainName,
      certificate: certificate,
    });

    this.createLambdaResources(this, applicationProps, api, [
      { functionName: 'users', moduleName: 'users' },
      { functionName: 'auth', moduleName: 'auth' },
      { functionName: 'subscriptions', moduleName: 'subscriptions' },
      { functionName: 'swagger', moduleName: 'swagger' },
    ]);

    // create lambda to run seeds
    const lambdaName = createName('seed-run', applicationProps);
    new LambdaResource(this, lambdaName, {
      functionName: 'seed-run',
      moduleName: 'common/database/seeds',
      ...applicationProps,
    });
  }
  createLambdaResources(
    scope: Construct,
    applicationProps: ApplicationProps,
    api: any,
    resources: any[],
  ): void {
    resources.forEach(({ functionName, moduleName }) => {
      const lambdaName = createName(functionName, applicationProps);
      const lambdaResource = new LambdaResource(scope, lambdaName, {
        functionName,
        moduleName,
        ...applicationProps,
      });

      const integration = new LambdaIntegration(lambdaResource.nodejsFunction, {
        proxy: true,
      });

      const resource = api.root.addResource(moduleName);
      resource.addResource('{proxy+}').addMethod('ANY', integration);
      resource.addMethod('ANY', integration);
    });
  }
}
