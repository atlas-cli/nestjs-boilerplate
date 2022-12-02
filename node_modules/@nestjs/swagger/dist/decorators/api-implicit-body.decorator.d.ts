import { Type } from '@nestjs/common';
import { RequestBodyObject } from '../interfaces/open-api-spec.interface';
export interface ApiImplicitBodyMetadata extends RequestBodyObject {
    name: string;
    type: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
}
export declare const ApiImplicitBody: (metadata: ApiImplicitBodyMetadata) => MethodDecorator;
