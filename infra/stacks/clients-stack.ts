import * as cdk from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import {
  ARecord,
  PublicHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { ApplicationProps } from '../props/application-props';
import { CloudFrontDistribution } from '../helpers/create-cloudfront-distribution';

export class ClientsStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    applicationProps: ApplicationProps
  ) {
    super(scope, id, applicationProps);

    const publicHostedZone = PublicHostedZone.fromHostedZoneAttributes(
      this,
      'Zone',
      {
        hostedZoneId: applicationProps.applications.core.idPublicHostZone,
        zoneName: applicationProps.applications.core.domainName,
      }
    );

    const certificate = new Certificate(this, 'ClientsCertificate', {
      domainName: applicationProps.applications.core.domainName,
      subjectAlternativeNames: [
        `*.${applicationProps.applications.core.domainName}`,
        applicationProps.applications.core.domainName,
      ],
      validation: CertificateValidation.fromDns(publicHostedZone),
    });

    // Create S3 Bucket
    const clientsBucket = new Bucket(this, 'ClientsBucket', {
      bucketName: 'clients-finance-baas-bucket',
      cors: [
        {
          allowedMethods: [HttpMethods.PUT],
          allowedHeaders: ['*'],
          allowedOrigins: ['*'],
        },
      ],
      publicReadAccess: false,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Create CloudFront Distribution
    const domainApp = `app.${applicationProps.applications.core.domainName}`;
    const clientAppDistribution = new CloudFrontDistribution(
      this,
      'AppDistribution',
      domainApp,
      clientsBucket,
      '/app',
      certificate
    );

    new ARecord(this, 'AppARecord', {
      zone: publicHostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(clientAppDistribution.distribution)),
      recordName: domainApp,
    });
  }
}
