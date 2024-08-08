import { Construct } from 'constructs';
import { join } from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
    DEFAULT_NESTJS_FUNCTION_PROPS,
    NESTJS_SWAGGER_MODULES,
} from './constants';
import { LambdaNestJsFunctionProps } from './props/lambda-nestjs-function.props';
import { createDatabaseAuroraEnvironment } from '../../helpers/create-database-aurora-environment';

export class LambdaNestJsFunction extends Construct {
    nodejsFunction: NodejsFunction;
    constructor(scope: Construct, id: string, props: LambdaNestJsFunctionProps) {
        super(scope, id);

        let { functionName, moduleName, environment } = props;

        if (props.database) {
            environment = {
                ...environment,
                ...createDatabaseAuroraEnvironment(props.database),
            };
        }

        const functionProps = {
            ...props,
            ...DEFAULT_NESTJS_FUNCTION_PROPS,
            environment: environment,
            entry: join(__dirname, '..', '..', '..', 'dist', 'app', moduleName, 'server.js'),
            functionName: functionName,
        };

        if (functionProps.swaggerBundling) {
            functionProps.bundling.nodeModules = NESTJS_SWAGGER_MODULES;
        }

        this.nodejsFunction = new NodejsFunction(this, functionName + `Service`, functionProps);
    }
}