import { NestMiddleware } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { I18nOptions } from '../index';
import { I18nService } from '../services/i18n.service';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
export declare class I18nMiddleware implements NestMiddleware {
    private readonly i18nOptions;
    private readonly i18nResolvers;
    private readonly i18nService;
    private readonly moduleRef;
    constructor(i18nOptions: I18nOptions, i18nResolvers: I18nOptionResolver[], i18nService: I18nService, moduleRef: ModuleRef);
    use(req: any, res: any, next: any): Promise<any>;
    private getResolver;
}
