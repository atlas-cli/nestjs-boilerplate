import { StripeModuleConfig } from '@golevelup/nestjs-stripe';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'stripe',
  () =>
    ({
      apiKey: process.env.STRIPE_API_KEY,
      webhookConfig: {
        controllerPrefix: 'subscriptions/stripe',
        stripeSecrets: {
          account: process.env.STRIPE_ACCOUNT_SECRET,
          connect: process.env.STRIPE_CONNECT_SECRET,
        },
      },
    } as StripeModuleConfig),
);
