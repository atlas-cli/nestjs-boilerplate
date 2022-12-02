import { I18nResolver } from '../index';
import { ExecutionContext } from '@nestjs/common';
export declare class GrpcMetadataResolver implements I18nResolver {
    private keys;
    constructor(keys?: string[]);
    resolve(context: ExecutionContext): Promise<string | string[] | undefined>;
}
