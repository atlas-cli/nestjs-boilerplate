import { StripeModule } from '@golevelup/nestjs-stripe';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { applyRawBodyOnlyTo } from './../../../common/utils/apply-raw-body-only-to';

@Module({
  imports: [
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('stripe'),
      inject: [ConfigService],
    }),
  ],
  exports: [StripeModule],
})
export class StripeSharedModule {
  configure(consumer: MiddlewareConsumer) {
    applyRawBodyOnlyTo(consumer, {
      method: RequestMethod.ALL,
      path: 'subscriptions/stripe/webhook',
    });
  }
}
