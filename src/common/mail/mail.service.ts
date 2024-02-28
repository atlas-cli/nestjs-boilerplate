/* eslint-disable prettier/prettier */
import AWS from 'aws-sdk';
import Handlebars from 'handlebars';
import { I18nModule, I18nService } from 'nestjs-i18n';

export class MailService {
  private readonly ses: AWS.SES;
  private readonly resetTemplate: HandlebarsTemplateDelegate;
  private readonly signupTemplate: HandlebarsTemplateDelegate;

  constructor(private readonly i18n: I18nService) {
    this.ses = new AWS.SES();

    this.resetTemplate = Handlebars.compile("./mail-templates/reset-password.hbs");
    this.signupTemplate = Handlebars.compile("./mail-templates/activation.hbs");
  }

  public async sendPasswordResetEmail(
    recipient: string,
    greetings: string,
    username: string,
    resetPasswordLinkMessage: string,
    resetPasswordLink: string,
    confirmationMessage: string,
    outroMessage: string,
    language = 'en',
  ): Promise<void> {
    const subject = await this.i18n.translate('resetPasswordSubject', { lang: language }) || 'Password Reset';
    const content = this.resetTemplate({ greetings, username, resetPasswordLinkMessage, resetPasswordLink, confirmationMessage, outroMessage, i18n: (key, options) => this.i18n.translate(key, { lang: language, ...options }) });
    const params: AWS.SES.SendEmailRequest = {
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: content,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'Your Sender Email Address Here',
    };
    try {
      const result = await this.ses.sendEmail(params).promise();
      console.log(`Email sent to ${recipient}. Message ID: ${result.MessageId}`);
    } catch (error) {
      console.error(`Error sending email to ${recipient}: ${error}`);
    }
  }

  public async sendActivationEmail(
    recipient: string,
    greetings: string,
    username: string,
    activationLinkMessage: string,
    activationLink: string,
    confirmationMessage: string,
    outroMessage: string,
    language = 'en',
  ): Promise<void> {
    const subject = await this.i18n.translate('activateAccountSubject', { lang: language }) || 'E-mail activation needed';
    const content = this.signupTemplate({ greetings, username, activationLink, activationLinkMessage, confirmationMessage, outroMessage, i18n: (key, options) => this.i18n.translate(key, { lang: language, ...options }) });
    const params: AWS.SES.SendEmailRequest = {
      Destination: { ToAddresses: [recipient] },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: content,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'Your Sender Email Address Here',
    };
    try {
      const result = await this.ses.sendEmail(params).promise();
      console.log(`Email sent to ${recipient}. Message ID: ${result.MessageId}`);
    } catch (error) {
      console.error(`Error sending email to ${recipient}: ${error}`);
    }
  }
}