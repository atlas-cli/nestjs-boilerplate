import { ConfigService } from '@nestjs/config';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
export declare class MailService {
    private i18n;
    private configService;
    constructor(i18n: I18nRequestScopeService, configService: ConfigService);
    userSignUp(_mailData: MailData<{
        hash: string;
    }>): Promise<void>;
    forgotPassword(_mailData: MailData<{
        hash: string;
    }>): Promise<void>;
}
