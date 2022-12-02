import { ExecutionContext } from '@nestjs/common';
import { I18nResolver } from '..';
export declare class CookieResolver implements I18nResolver {
    private readonly cookieNames;
    constructor(cookieNames?: string[]);
    resolve(context: ExecutionContext): string | string[] | undefined;
}
