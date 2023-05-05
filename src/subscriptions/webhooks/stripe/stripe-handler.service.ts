import { Injectable } from '@nestjs/common';
import { StripeWebhookHandler } from '@golevelup/nestjs-stripe';
import { SubscriptionsService } from './../../subscriptions.service';
import Stripe from 'stripe';
import { OrganizationsService } from 'users/organizations/organizations.service';

@Injectable()
export class StripeHandlersService {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly organizationsService: OrganizationsService,
  ) {}
  @StripeWebhookHandler('customer.subscription.updated')
  async costumerSubscriptionUpdate(event: Stripe.Event) {
    const subscriptionData: Stripe.Subscription = event.data
      .object as Stripe.Subscription;

    const organizationStatus =
      subscriptionData.status === 'active' ||
      subscriptionData.status === 'trialing'
        ? 'active'
        : 'inactive';

    await this.organizationsService.update(
      subscriptionData.metadata.organization,
      {
        status: organizationStatus,
      },
    );

    await this.subscriptionsService.updateSubscription(subscriptionData.id, {
      status: subscriptionData.status,
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
    });
  }
  @StripeWebhookHandler('customer.subscription.deleted')
  async costumerSubscriptionDeleted(event: Stripe.Event) {
    const subscriptionData: Stripe.Subscription = event.data
      .object as Stripe.Subscription;

    const organizationStatus =
      subscriptionData.status === 'active' ||
      subscriptionData.status === 'trialing'
        ? 'active'
        : 'inactive';

    await this.organizationsService.update(
      subscriptionData.metadata.organization,
      {
        status: organizationStatus,
      },
    );

    await this.subscriptionsService.updateSubscription(subscriptionData.id, {
      status: subscriptionData.status,
      cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
    });
  }
}
