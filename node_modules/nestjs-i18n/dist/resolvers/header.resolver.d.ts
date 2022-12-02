import { I18nResolver } from '../index';
import { ExecutionContext } from '@nestjs/common';
export declare class HeaderResolver implements I18nResolver {
    private keys;
    private logger;
    constructor(keys?: string[]);
    resolve(context: ExecutionContext): string;
}
