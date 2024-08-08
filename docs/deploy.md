# Setting Up Your AWS Environment with CDK and Node.js

This tutorial will guide you through setting up your development environment on AWS using the AWS Cloud Development Kit (CDK) with Node.js 20 and npm. We'll also cover how to configure your AWS credentials and deploy your stack.

## Prerequisites

1. **Node.js 20**: Ensure you have Node.js 20 installed. You can download it from [here](https://nodejs.org/).
2. **AWS CLI**: Make sure you have the AWS Command Line Interface (CLI) installed. You can follow the installation guide [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).
3. **AWS CDK**: Install the AWS CDK globally by running:
```bash
   npm install -g aws-cdk
```

## Step 1: Configure AWS Credentials

You can configure your AWS credentials in two ways:

**Option 1: AWS SSO**

1. Configure AWS SSO:
```bash
   aws configure sso
```

**Option 2: AWS Access Keys**

1. Create an IAM user with programmatic access in the AWS Management Console and generate an access key and secret access key.

2. Configure AWS credentials:
```bash
   aws configure
```

## Step 2: Bootstrap Your CDK Application

1. Create a new CDK app:
```bash
   cdk init app --language typescript
```

2. Install the necessary dependencies:
```bash
   npm install
```


## Step 3: Define Your Infrastructure

1. Open the `infra/configs/production.ts` file and update it with the following content:
```typescript
export const production: ApplicationProps = {
    applicationName: 'FinanceBaas',
    stageName: 'production',
    env: {
        account: '025066284119',
        region: 'us-east-1',
    },
    githubOrganizationId: environment.parsed.ORGANIZATION_GITHUB_ORGANIZATION_ID,
    layersStack: stacks,
    applications: {
        core: {
            domainName: 'boilerplate.atlascli.io',
            apiDomainName: 'api.boilerplate.atlascli.io',
            idPublicHostZone: 'Z03396972KP6M49QCZJPD',
            applicationEnvironment: {
                NODE_ENV: environment.parsed.NODE_ENV || 'development',
                APP_PORT: environment.parsed.APP_PORT || '3000',
                APP_NAME: environment.parsed.APP_NAME || 'NestJS Boilerplate',
                API_PREFIX: environment.parsed.API_PREFIX || 'api',
                APP_FALLBACK_LANGUAGE: environment.parsed.APP_FALLBACK_LANGUAGE || 'en',
                APP_HEADER_LANGUAGE: environment.parsed.APP_HEADER_LANGUAGE || 'x-custom-lang',
                BACKEND_DOMAIN: environment.parsed.BACKEND_DOMAIN || 'http://localhost:3000',
                FRONTEND_DOMAIN: environment.parsed.BACKEND_DOMAIN || 'http://localhost:4200',
                SWAGGER_ENABLED: environment.parsed.SWAGGER_ENABLED || 'true',
                I18N_DIRECTORY: environment.parsed.I18N_DIRECTORY || 'src/i18n',
                AUTH_JWT_SECRET: environment.parsed.AUTH_JWT_SECRET || 'secret',
                AUTH_JWT_TOKEN_EXPIRES_IN: environment.parsed.AUTH_JWT_TOKEN_EXPIRES_IN || '1d',
            },
        },
    },
};

   // To start this repository on AWS, you need to have a Hosted Zone on Route53 on AWS,
   // this is important because we generate all the necessary certificates and publish 
   // the records on the domain, as well as link all the APIs in a subdomain.domain.com.
```
Also in the file infra/constructs/lambda-nestjs-function/constants.ts, the variable DEFAULT_NESTJS_LAMBDA_ENVIRONMENT contains the environment variables for your AWS Lambda functions using NestJS.

If you change the applicationName in infra/index.ts, you should update the SESSIONS_TABLE_NAME to 'atlas-production-sessions'.

## Step 4: Deploy Your Stack

1. Specify the profile and deploy your stack:
```bash
npm run build
npx cdk deploy --all --profile AdministratorAccess-XXXXXXXXXXXX
```

## Step 5: Run Your Lambda Function to run migrations

If you have a Lambda function to run, use the following command, replacing `LAMBDA_NAME` with the appropriate name:
```bash
LAMBDA_NAME=dev-atlas-lambda-database-migration npm run lambda:typeorm
```
