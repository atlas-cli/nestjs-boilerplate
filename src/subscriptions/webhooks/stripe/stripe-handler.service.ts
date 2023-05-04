import { Injectable } from '@nestjs/common';
import { StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { SubscriptionsService } from './../../subscriptions.service';
import Stripe from 'stripe';

@Injectable()
export class StripeHandlersService {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}
  @StripeWebhookHandler('customer.subscription.updated')
  async handleCheckoutSessionCompleted(event: Stripe.Event) {
    const subscriptionData: Stripe.Subscription = event.data
      .object as Stripe.Subscription;
    await this.subscriptionsService.updateSubscriptionStatus(
      subscriptionData.id,
      {
        status: subscriptionData.status,
      },
    );
  }
}
