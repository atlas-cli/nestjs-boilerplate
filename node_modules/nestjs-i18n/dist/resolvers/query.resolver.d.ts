import { I18nResolver } from '../index';
import { ExecutionContext } from '@nestjs/common';
export declare class QueryResolver implements I18nResolver {
    private keys;
    constructor(keys?: string[]);
    resolve(context: ExecutionContext): string;
}
