import { Type } from '@nestjs/common';
import { ParameterObject } from '../interfaces/open-api-spec.interface';
import { SwaggerEnumType } from '../types/swagger-enum.type';
export declare type ApiImplicitParamMetadata = Omit<ParameterObject, 'in'> & {
    type?: Type<unknown> | Function | [Function] | string;
    enum?: SwaggerEnumType;
};
export declare const ApiImplicitParam: (metadata: ApiImplicitParamMetadata) => MethodDecorator;
