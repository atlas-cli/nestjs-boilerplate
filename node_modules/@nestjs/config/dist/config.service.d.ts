import { NoInferType, Path, PathValue } from './types';
/**
 * `ExcludeUndefinedIf<ExcludeUndefined, T>
 *
 * If `ExcludeUndefined` is `true`, remove `undefined` from `T`.
 * Otherwise, constructs the type `T` with `undefined`.
 */
declare type ExcludeUndefinedIf<ExcludeUndefined extends boolean, T> = ExcludeUndefined extends true ? Exclude<T, undefined> : T | undefined;
export interface ConfigGetOptions {
    /**
     * If present, "get" method will try to automatically
     * infer a type of property based on the type argument
     * specified at the "ConfigService" class-level (example: ConfigService<Configuration>).
     */
    infer: true;
}
declare type KeyOf<T> = keyof T extends never ? string : keyof T;
export declare class ConfigService<K = Record<string, unknown>, WasValidated extends boolean = false> {
    private readonly internalConfig;
    private set isCacheEnabled(value);
    private get isCacheEnabled();
    private readonly cache;
    private _isCacheEnabled;
    constructor(internalConfig?: Record<string, any>);
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * @param propertyPath
     */
    get<T = any>(propertyPath: KeyOf<K>): ExcludeUndefinedIf<WasValidated, T>;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * @param propertyPath
     * @param options
     */
    get<T = K, P extends Path<T> = any, R = PathValue<T, P>>(propertyPath: P, options: ConfigGetOptions): ExcludeUndefinedIf<WasValidated, R>;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * @param propertyPath
     * @param defaultValue
     */
    get<T = any>(propertyPath: KeyOf<K>, defaultValue: NoInferType<T>): T;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * @param propertyPath
     * @param defaultValue
     * @param options
     */
    get<T = K, P extends Path<T> = any, R = PathValue<T, P>>(propertyPath: P, defaultValue: NoInferType<R>, options: ConfigGetOptions): R;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * @param propertyPath
     */
    getOrThrow<T = any>(propertyPath: KeyOf<K>): Exclude<T, undefined>;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * @param propertyPath
     * @param options
     */
    getOrThrow<T = K, P extends Path<T> = any>(propertyPath: P, options: ConfigGetOptions): Exclude<T, undefined>;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * If the default value is undefined an exception will be thrown.
     * @param propertyPath
     * @param defaultValue
     */
    getOrThrow<T = any>(propertyPath: KeyOf<K>, defaultValue: NoInferType<T>): Exclude<T, undefined>;
    /**
     * Get a configuration value (either custom configuration or process environment variable)
     * based on property path (you can use dot notation to traverse nested object, e.g. "database.host").
     * It returns a default value if the key does not exist.
     * If the default value is undefined an exception will be thrown.
     * @param propertyPath
     * @param defaultValue
     * @param options
     */
    getOrThrow<T = K, P extends Path<T> = any, R = PathValue<T, P>>(propertyPath: P, defaultValue: NoInferType<R>, options: ConfigGetOptions): Exclude<R, undefined>;
    private getFromCache;
    private getFromValidatedEnv;
    private getFromProcessEnv;
    private getFromInternalConfig;
    private setInCacheIfDefined;
    private isGetOptionsObject;
}
export {};
