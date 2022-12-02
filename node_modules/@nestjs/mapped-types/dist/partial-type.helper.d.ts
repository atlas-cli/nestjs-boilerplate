import { Type } from '@nestjs/common';
import { MappedType } from './mapped-type.interface';
export declare function PartialType<T>(classRef: Type<T>): MappedType<Partial<T>>;
