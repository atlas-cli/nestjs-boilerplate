import { SchemaObjectMetadata } from '../interfaces/schema-object-metadata.interface';
export declare type ApiModelPropertyMetadata = SchemaObjectMetadata;
export declare const ApiModelProperty: (metadata?: SchemaObjectMetadata) => PropertyDecorator;
export declare const ApiModelPropertyOptional: (metadata?: SchemaObjectMetadata) => PropertyDecorator;
export declare const ApiResponseModelProperty: (metadata?: Pick<SchemaObjectMetadata, "type" | "example">) => PropertyDecorator;
