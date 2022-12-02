export declare class SchematicOption {
    private name;
    private value;
    private keepInputNameFormat;
    constructor(name: string, value: boolean | string, keepInputNameFormat?: boolean);
    toCommandString(): string;
    private format;
}
