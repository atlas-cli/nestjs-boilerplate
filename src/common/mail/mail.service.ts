import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18n, I18nRequestScopeService } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor(
    @I18n()
    private _i18n: I18nRequestScopeService,
    private _configService: ConfigService,
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async userSignUp(_mailData: MailData<{ hash: string }>) { return; }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forgotPassword(_mailData: MailData<{ hash: string }>) {
    return;
  }
}
