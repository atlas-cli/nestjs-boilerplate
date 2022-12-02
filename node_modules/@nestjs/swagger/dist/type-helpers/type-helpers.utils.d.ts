import { Type } from '@nestjs/common';
export declare function applyIsOptionalDecorator(targetClass: Function, propertyKey: string): void;
export declare function inheritValidationMetadata(parentClass: Type<any>, targetClass: Function, isPropertyInherited?: (key: string) => boolean): void;
export declare function inheritTransformationMetadata(parentClass: Type<any>, targetClass: Function, isPropertyInherited?: (key: string) => boolean): void;
