import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { OrganizationsService } from './../users/organizations/organizations.service';
import { Types } from 'mongoose';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Product, ProductDocument } from './models/product.model';
import {
  Subscription,
  SubscriptionDocument,
} from './models/subscription.model';
import { SubscriptionStatus } from './enums/subscription-status.enum';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PlansService } from './plans/plans.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectStripeClient()
    private stripeClient: Stripe,
    private organizationsService: OrganizationsService,
    private plansService: PlansService,
    private configService: ConfigService,
  ) {}
  async createStripeOrganizationCustomer(organizationId: string) {
    const customerOrganizationId = new Types.ObjectId(organizationId);
    const organization = await this.organizationsService.findOne(
      customerOrganizationId,
    );
    if (organization.stripeCustomerId !== undefined) {
      return organization.stripeCustomerId;
    }

    const customer = await this.stripeClient.customers.create({
      email: organization.email,
      name: organization.name,
    });
    await this.organizationsService.update(customerOrganizationId, {
      stripeCustomerId: customer.id,
    });
    return customer.id;
  }
  async buildItems(createSubscriptionDto: CreateSubscriptionDto) {
    const productsIds = createSubscriptionDto.products.map(
      (product) => product.id,
    );
    // when not have products add a trial product
    if (productsIds.length === 0) {
      productsIds.push('trial');
    }
    const products = await this.productModel.find({
      stripeProductId: { $in: productsIds },
    });

    const items = products.map((product) => {
      const price = product.prices.find(
        (price) => price.type === createSubscriptionDto.interval,
      );
      const requestProduct = createSubscriptionDto.products.find(
        (requestProduct) => requestProduct.id === product.stripeProductId,
      );
      if (product.type === 'standard') {
        return { price: price.id };
      }
      // quantity if not exits default is 1 for get a first tier
      let quantity = requestProduct?.quantity ?? 1;
      // if product is recording you need get the classrom quantity
      if (product.stripeProductId === 'recording') {
        const classroomProduct = createSubscriptionDto.products.find(
          (requestProduct) => requestProduct.id === 'classroom',
        );
        quantity = classroomProduct.quantity;
      }
      return { price: price.id, quantity };
    });
    return items;
  }

  async listStripeSubscriptions(costumerOrganizationId: string) {
    return await this.stripeClient.subscriptions.list({
      customer: costumerOrganizationId,
    });
  }

  async cancelSubscriptions(subscriptionsIds: string[]) {
    const subscriptionsToDelete = subscriptionsIds.map((id) =>
      this.stripeClient.subscriptions.del(id),
    );
    await Promise.all(subscriptionsToDelete);
  }
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    customerId: string,
    organizationId: string,
    items: { price: string }[],
  ) {
    const plan = await this.plansService.findOne(createSubscriptionDto.planId);
    const organization = await this.organizationsService.findOne(
      organizationId,
    );
    let trialPeriodParams = {};
    if (plan.trialPeriodDays > 0 && organization.hasUsedTrial === false) {
      await this.organizationsService.update(organizationId, {
        hasUsedTrial: true,
      });
      trialPeriodParams = {
        trial_period_days: plan.trialPeriodDays,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
      };
    }
    const subscription = await this.stripeClient.subscriptions.create({
      customer: customerId,
      items,
      currency: createSubscriptionDto.currency,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      ...trialPeriodParams,
      metadata: {
        planId: createSubscriptionDto.planId,
        organization: organizationId,
      },
    });

    const quotas = this.buildQuotas(createSubscriptionDto);

    await this.subscriptionModel.create({
      stripeSubscriptionId: subscription.id,
      plan: createSubscriptionDto.planId,
      organization: new Types.ObjectId(organizationId),
      quotas,
      status: subscription.status,
    });

    return subscription;
  }
  buildQuotas(createSubscriptionDto) {
    const findQuota = (id) =>
      createSubscriptionDto.products.find((product) => product.id === id)
        ?.quantity ?? 0;

    return {
      students: findQuota('students'),
      classroom: findQuota('classroom'),
      recording: findQuota('recording') > 0 ? findQuota('classroom') : 0,
      storage: findQuota('storage'),
      teachers: findQuota('teachers'),
    };
  }
  async updateStripeSubscription(
    stripeSubscriptionId: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    items: { price: string; id?: string }[],
  ) {
    let subscription = await this.stripeClient.subscriptions.retrieve(
      stripeSubscriptionId,
    );

    // populate prices ids matches
    items = items.map((item) => {
      item.id = subscription.items.data.find(
        (subscriptionItem) => subscriptionItem.price.id === item.price,
      )?.id;
      return item;
    });

    // remove item from legacy subscription
    const removedItems = subscription.items.data
      .filter((subscriptionItem) => {
        return !items.find((item) => item.price === subscriptionItem.price.id);
      })
      .map((subscriptionItem) => ({
        id: subscriptionItem.id,
        quantity: 0,
        deleted: true,
      }));
    if (subscription.status === 'trialing') {
      const plan = await this.plansService.findOne(
        updateSubscriptionDto.planId,
      );
      if (
        plan.trialPeriodDays === undefined ||
        plan.trialPeriodDays === undefined
      ) {
        throw new BadRequestException(
          'you cannot you cannot switch from a trial plan to a non-trial plan, you need cancel your subscription and create another',
        );
      }
    }
    subscription = await this.stripeClient.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',
        items: [...items, ...removedItems],
        metadata: {
          planId: updateSubscriptionDto.planId,
          organization: updateSubscriptionDto.organizationId,
        },
      },
    );

    const quotas = this.buildQuotas(updateSubscriptionDto);

    await this.updateSubscription(stripeSubscriptionId, {
      plan: updateSubscriptionDto.planId,
      status: subscription.status,
      quotas,
    });
  }
  async updateSubscription(stripeSubscriptionId, update) {
    return await this.subscriptionModel.updateOne(
      {
        stripeSubscriptionId,
      },
      update,
    );
  }

  async createSession(costumerOrganizationId) {
    return await this.stripeClient.billingPortal.sessions.create({
      customer: costumerOrganizationId,
      return_url: this.configService.get('app.frontendDomain'),
    });
  }

  async getSubscription(subscriptionId) {
    return await this.subscriptionModel.findOne(
      new Types.ObjectId(subscriptionId),
    );
  }

  async cancelStripeSubscriptionImmediately(stripeSubscriptionId: string) {
    await this.stripeClient.subscriptions.cancel(stripeSubscriptionId);
  }
  async cancelStripeSubscriptionOnPeriodEnd(stripeSubscriptionId: string) {
    return await this.stripeClient.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
      trial_end: 'now',
    });
  }

  async getActiveSubscription(organizationId) {
    return await this.subscriptionModel
      .findOne({
        organization: new Types.ObjectId(organizationId),
        status: {
          $in: [SubscriptionStatus.active, SubscriptionStatus.trialing],
        },
      })
      .populate('plan');
  }
}
