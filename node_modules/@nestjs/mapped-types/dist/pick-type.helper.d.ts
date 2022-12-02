import { Type } from '@nestjs/common';
import { MappedType } from './mapped-type.interface';
export declare function PickType<T, K extends keyof T>(classRef: Type<T>, keys: readonly K[]): MappedType<Pick<T, typeof keys[number]>>;
