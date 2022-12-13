import { ContentHandling, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { join } from 'path'
import { NodejsFunction, } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RDS } from 'aws-sdk';

export class LambdaServiceStack extends Stack {
    constructor(app: App, id: string, { stage }: any) {
        super(app, id);
        const name = 'lambda-service-' + stage;
        const auroraName = 'aurora-' + stage;

        const roleArn = cdk.Fn.importValue(auroraName + '-role');
        const role = iam.Role.fromRoleArn(this, 'DbRole', roleArn);
        

        const httpLambda = new NodejsFunction(this, name, {
            functionName: name,
            role,
            bundling: {
                minify: true,
                externalModules: [
                    'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
                    'kafkajs',
                    'mqtt',
                    'amqplib',
                    'amqp-connection-manager',
                    'nats',
                    '@grpc/grpc-js',
                    '@grpc/proto-loader',
                    '@nestjs/websockets/socket-module',
                    'class-transformer/storage',
                    'pg-native',
                    'hbs',
                    'nestjs-redoc',
                    'cache-manager',
                ],
                nodeModules: [
                    '@nestjs/microservices',
                    'pg',
                ],
                commandHooks: {
                    afterBundling(inputDir: string, outputDir: string): string[] {
                        return [];
                    },
                    beforeInstall(inputDir: string, outputDir: string): string[] {
                        return [];
                    },
                    beforeBundling(inputDir: string, outputDir: string): string[] {
                        console.log(inputDir);
                        return [];
                    },
                },
            },
            memorySize: 2048,
            timeout: Duration.seconds(6),
            depsLockFilePath: join(__dirname, '..', '..', '..', 'package-lock.json'),
            entry: join(__dirname, '..', '..', '..', 'dist', 'app', 'users', 'server.js'),
            runtime: Runtime.NODEJS_16_X,
            environment: {
                DATABASE_TYPE: 'postgres',
                DATABASE_HOST: cdk.Fn.importValue(auroraName + '-host'),
                DATABASE_USERNAME: 'postgres',
                DATABASE_PORT: '5432',
                DATABASE_NAME: 'aurora-stack-auroraqadbclusterc48fb8ef-0c3tn1t75bys',
                DATABASE_REJECT_UNAUTHORIZED: 'true',
            },
        });

        // Integrate the Lambda functions with the API Gateway resource
        const httpIntegration = new LambdaIntegration(httpLambda, {
            contentHandling: ContentHandling.CONVERT_TO_TEXT,
        });


        // Create an API Gateway resource for each of the CRUD operations
        const api = new RestApi(this, name + '-api-gateway', {
            restApiName: name + '-api-gateway',
            // binaryMediaTypes: ['*/*'],
            binaryMediaTypes: ['text/plain'],
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
            },
        });

        const items = api.root.addResource('{proxy+}');
        items.addMethod('ANY', httpIntegration);
    }
}
