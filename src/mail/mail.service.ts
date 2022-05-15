import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import * as FormData from 'form-data';
import got from 'got';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(subject: string, template: string, emailVars: EmailVar[]) {
    //to:string
    const form = new FormData();
    form.append('from', `Nanino < Nanino@mailgun-test.com >`);
    form.append('to', `realteapots@naver.com`); //realteapots@naver.com 0902ab@naver.com
    form.append('subject', subject);
    form.append('template', template); 
    emailVars.forEach((e) => form.append(`v:${e.key}`, e.value));
    try {
      await got.post(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('Verify Your Email', 'new_template', [
      { key: 'code', value: code },
      { key: 'name', value: email },
    ]);
  }
}
//{Key:"code", value:code},{Key:"name", value:email}
