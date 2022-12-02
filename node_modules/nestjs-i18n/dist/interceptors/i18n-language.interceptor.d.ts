import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { I18nOptions } from '../index';
import { I18nService } from '../services/i18n.service';
import { ModuleRef } from '@nestjs/core';
import { I18nOptionResolver } from '../interfaces/i18n-options.interface';
import { Observable } from 'rxjs';
export declare class I18nLanguageInterceptor implements NestInterceptor {
    private readonly i18nOptions;
    private readonly i18nResolvers;
    private readonly i18nService;
    private readonly moduleRef;
    constructor(i18nOptions: I18nOptions, i18nResolvers: I18nOptionResolver[], i18nService: I18nService, moduleRef: ModuleRef);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>>;
    private getResolver;
}
