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
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async userSignUp(_mailData: MailData<{ hash: string }>) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forgotPassword(_mailData: MailData<{ hash: string }>) {
    // await this.mailerService.sendMail({
    //   to: mailData.to,
    //   subject: await this.i18n.t('common.resetPassword'),
    //   text: `${this.configService.get('app.frontendDomain')}/password-change/${
    //     mailData.data.hash
    //   } ${await this.i18n.t('common.resetPassword')}`,
    //   template: 'reset-password',
    //   context: {
    //     title: await this.i18n.t('common.resetPassword'),
    //     url: `${this.configService.get('app.frontendDomain')}/password-change/${
    //       mailData.data.hash
    //     }`,
    //     actionTitle: await this.i18n.t('common.resetPassword'),
    //     app_name: this.configService.get('app.name'),
    //     text1: await this.i18n.t('reset-password.text1'),
    //     text2: await this.i18n.t('reset-password.text2'),
    //     text3: await this.i18n.t('reset-password.text3'),
    //     text4: await this.i18n.t('reset-password.text4'),
    //   },
    // });
  }
}
