import { Type } from '@nestjs/common';
import { ModelPropertiesAccessor } from './model-properties-accessor';
import { ParamsWithType, ParamWithTypeMetadata } from './parameter-metadata-accessor';
export declare class ParametersMetadataMapper {
    private readonly modelPropertiesAccessor;
    constructor(modelPropertiesAccessor: ModelPropertiesAccessor);
    transformModelToProperties(parameters: ParamsWithType): ParamWithTypeMetadata[];
    mergeImplicitWithExplicit(key: string, prototype: Type<unknown>, param: ParamWithTypeMetadata): ParamWithTypeMetadata;
}
