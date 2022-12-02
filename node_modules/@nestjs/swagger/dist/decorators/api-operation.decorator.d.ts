import { OperationObject } from '../interfaces/open-api-spec.interface';
export declare type ApiOperationOptions = Partial<OperationObject>;
export declare function ApiOperation(options: ApiOperationOptions): MethodDecorator;
