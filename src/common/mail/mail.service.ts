import { Injectable } from '@nestjs/common';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async userSignUp(_mailData: MailData<{ hash: string }>) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forgotPassword(_mailData: MailData<{ hash: string }>) {
    return;
  }
}
