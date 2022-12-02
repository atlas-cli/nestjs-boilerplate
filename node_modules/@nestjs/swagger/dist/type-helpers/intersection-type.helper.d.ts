import { Type } from '@nestjs/common';
export declare function IntersectionType<A, B>(classARef: Type<A>, classBRef: Type<B>): Type<A & B>;
