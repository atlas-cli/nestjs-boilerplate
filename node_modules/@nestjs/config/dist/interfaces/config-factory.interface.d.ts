import { ConfigObject } from '../types';
declare type ConfigFactoryReturnValue<T extends ConfigObject> = T | Promise<T>;
export declare type ConfigFactory<T extends ConfigObject = ConfigObject> = () => ConfigFactoryReturnValue<T>;
export {};
