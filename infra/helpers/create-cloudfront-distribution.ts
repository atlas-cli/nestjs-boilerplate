import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import {
  Behavior,
  CloudFrontWebDistribution,
  Distribution,
  OriginAccessIdentity,
  ViewerCertificate,
} from 'aws-cdk-lib/aws-cloudfront';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getHttpRedirects } from '../utils/cloudfront-utils';
import { createOutput } from './create-output';

const createCloudFrontDistribution = (
  scope: Construct,
  id: string,
  domainName: string,
  bucket: Bucket,
  originPath: string,
  certificate: ICertificate,
  resizeEdgeEnabled?: boolean,
  lambdaEdge?: any,
  behaviors: Behavior[] = [{ isDefaultBehavior: true }],
): CloudFrontWebDistribution | Distribution => {
  const createOriginAccessIdentity = (
    id: string,
    bucket: Bucket,
  ): OriginAccessIdentity => {
    const originAccessIdentity = new OriginAccessIdentity(
      scope,
      `${id}OriginAccessIdentity`,
    );
    bucket.grantRead(originAccessIdentity);
    return originAccessIdentity;
  };

  const createDistributionWithoutCachePolicy = (
    id: string,
    domainName: string,
    bucket: Bucket,
    originPath: string,
    certificate: ICertificate,
    behaviors: Behavior[],
  ): CloudFrontWebDistribution => {
    const originAccessIdentity = createOriginAccessIdentity(id, bucket);
    const props: any = {
      viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: [domainName],
      }),
      errorConfigurations: getHttpRedirects([400, 403, 404]),
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity,
            originPath,
          },
          behaviors,
        },
      ],
    };
    return new CloudFrontWebDistribution(scope, id + 'WebDistribution', props);
  };

  const distribution = createDistributionWithoutCachePolicy(
    id,
    domainName,
    bucket,
    originPath,
    certificate,
    behaviors,
  );

  createOutput(scope, `${id}DistributionId`, distribution.distributionId);

  return distribution;
};

export class CloudFrontDistribution extends Construct {
  distribution: CloudFrontWebDistribution | Distribution;

  constructor(
    scope: Construct,
    id: string,
    domainName: string,
    bucket: Bucket,
    originPath: string,
    certificate: ICertificate,
    resizeEdgeEnabled?: boolean,
    lambdaEdge?: any,
    behaviors: Behavior[] = [{ isDefaultBehavior: true }],
  ) {
    super(scope, id);
    this.distribution = createCloudFrontDistribution(
      scope,
      id,
      domainName,
      bucket,
      originPath,
      certificate,
      resizeEdgeEnabled,
      lambdaEdge,
      behaviors,
    );
  }
}
