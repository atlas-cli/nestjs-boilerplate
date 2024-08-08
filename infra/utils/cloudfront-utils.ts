import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

export const CLOUDFRONT_ERROR_REDIRECT: {
  [key: number]: cloudfront.CfnDistribution.CustomErrorResponseProperty;
} = {
  400: {
    errorCode: 400,
    responseCode: 200,
    responsePagePath: '/index.html',
  },
  403: {
    errorCode: 403,
    responseCode: 200,
    responsePagePath: '/index.html',
  },
  404: {
    errorCode: 404,
    responseCode: 200,
    responsePagePath: '/index.html',
  },
};

export function getHttpRedirect(id: number) {
  return CLOUDFRONT_ERROR_REDIRECT[id];
}

export function getHttpRedirects(errorCodes: number[]): any {
  let errorCodesResponse: cloudfront.CfnDistribution.CustomErrorResponseProperty[];
  errorCodes.forEach((code) => {
    if (!errorCodesResponse) {
      errorCodesResponse = [getHttpRedirect(code)];
    } else {
      errorCodesResponse.push(getHttpRedirect(code));
    }
  });
  return errorCodesResponse!;
}
