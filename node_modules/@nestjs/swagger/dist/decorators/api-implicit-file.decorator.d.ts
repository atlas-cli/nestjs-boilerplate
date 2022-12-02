export interface ApiImplicitFileMetadata {
    name: string;
    description?: string;
    required?: boolean;
}
export declare const ApiImplicitFile: (metadata: ApiImplicitFileMetadata) => MethodDecorator;
