/**
 * Evaluates to `true` if `T` is `any`. `false` otherwise.
 * (c) https://stackoverflow.com/a/68633327/5290447
 */
declare type IsAny<T> = unknown extends T ? [keyof T] extends [never] ? false : true : false;
export declare type PathImpl<T, Key extends keyof T> = Key extends string ? IsAny<T[Key]> extends true ? never : T[Key] extends Record<string, any> ? `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}` | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}` : never : never;
export declare type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;
export declare type Path<T> = keyof T extends string ? PathImpl2<T> extends infer P ? P extends string | keyof T ? P : keyof T : keyof T : never;
export declare type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}` ? Key extends keyof T ? Rest extends Path<T[Key]> ? PathValue<T[Key], Rest> : never : never : P extends keyof T ? T[P] : never;
export {};
