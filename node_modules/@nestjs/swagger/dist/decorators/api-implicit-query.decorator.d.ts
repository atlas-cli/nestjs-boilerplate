import { Type } from '@nestjs/common';
import { ParameterObject } from '../interfaces/open-api-spec.interface';
import { SwaggerEnumType } from '../types/swagger-enum.type';
export interface ApiImplicitQueryMetadata extends Omit<ParameterObject, 'in'> {
    type?: Type<unknown> | Function | [Function] | string;
    isArray?: boolean;
    enum?: SwaggerEnumType;
}
export declare const ApiImplicitQuery: (metadata: ApiImplicitQueryMetadata) => MethodDecorator;
