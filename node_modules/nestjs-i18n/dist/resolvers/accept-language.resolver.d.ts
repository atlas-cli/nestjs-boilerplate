import { I18nResolver } from '../index';
import { ExecutionContext } from '@nestjs/common';
interface AcceptLanguageResolverOptions {
    matchType: 'strict' | 'loose' | 'strict-loose';
}
export declare class AcceptLanguageResolver implements I18nResolver {
    private options;
    constructor(options?: AcceptLanguageResolverOptions);
    resolve(context: ExecutionContext): Promise<string | string[] | undefined>;
}
export {};
