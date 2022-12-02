import { Type } from '@nestjs/common';
import { ParameterObject } from '../interfaces/open-api-spec.interface';
import { SwaggerEnumType } from '../types/swagger-enum.type';
export interface ApiImplicitHeaderMetadata extends Omit<ParameterObject, 'in'> {
    type?: Type<unknown> | Function | [Function] | string;
    enum?: SwaggerEnumType;
}
export declare const ApiImplicitHeader: (metadata: ApiImplicitHeaderMetadata) => MethodDecorator;
export declare const ApiImplicitHeaders: (headers: ApiImplicitHeaderMetadata[]) => MethodDecorator;
