import { ConfigService } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
export declare class MailConfigService implements MailerOptionsFactory {
    private configService;
    constructor(configService: ConfigService);
    createMailerOptions(): MailerOptions;
}
