import { OpenAPIObject } from '.';
export declare type ModuleRoute = Omit<OpenAPIObject, 'openapi' | 'info'> & Record<'root', any>;
