import { Type } from '@nestjs/common';
import { MappedType } from './mapped-type.interface';
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
declare type ClassRefsToConstructors<T extends Type[]> = {
    [U in keyof T]: T[U] extends Type<infer V> ? V : never;
};
declare type Intersection<T extends Type[]> = MappedType<UnionToIntersection<ClassRefsToConstructors<T>[number]>>;
export declare function IntersectionType<T extends Type[]>(...classRefs: T): Intersection<T>;
export {};
