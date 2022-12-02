import { Type } from '../interfaces';
export declare function PassportStrategy<T extends Type<any> = any>(Strategy: T, name?: string | undefined): {
    new (...args: any[]): InstanceType<T>;
};
