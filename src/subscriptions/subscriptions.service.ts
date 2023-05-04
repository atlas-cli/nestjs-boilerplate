import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Product.name)
    private productRepository: Model<ProductDocument>,
    @InjectModel(Subscription.name)
    private subscriptionRepository: Model<SubscriptionDocument>,
    private organizationService: OrganizationsService,
    @InjectStripeClient() private stripeClient: Stripe,
  ) {}
  async createStripeOrganizationCustomer(organizationId: string) {
    const customerOrganizationId = new Types.ObjectId(organizationId);
    const organization = await this.organizationService.findOne(
      customerOrganizationId,
    );
    if (organization.stripeCustomerId !== undefined) {
      return organization.stripeCustomerId;
    }

    const customer = await this.stripeClient.customers.create({
      email: organization.email,
      name: organization.name,
    });
    await this.organizationService.update(customerOrganizationId, {
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
    const products = await this.productRepository.find({
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
    const subscription = await this.stripeClient.subscriptions.create({
      customer: customerId,
      items,
      currency: createSubscriptionDto.currency,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      metadata: {
        planId: createSubscriptionDto.planId,
        organization: organizationId,
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const quotas = this.buildQuotas(createSubscriptionDto);

    await this.subscriptionRepository.create({
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
    createSubscriptionDto: UpdateSubscriptionDto,
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
      .map((subscriptionItem) => ({ id: subscriptionItem.id, quantity: 0 }));

    subscription = await this.stripeClient.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: false,
        proration_behavior: 'create_prorations',
        items: [...items, ...removedItems],
        metadata: {
          planId: createSubscriptionDto.planId,
          organization: createSubscriptionDto.organizationId,
        },
      },
    );

    const quotas = this.buildQuotas(createSubscriptionDto);

    await this.updateSubscriptionStatus(stripeSubscriptionId, {
      plan: createSubscriptionDto.planId,
      status: subscription.status,
      quotas,
    });
  }
  async updateSubscriptionStatus(stripeSubscriptionId, update) {
    return await this.subscriptionRepository.updateOne(
      {
        stripeSubscriptionId,
      },
      update,
    );
  }

  async getActiveSubscription(organizationId) {
    return await this.subscriptionRepository
      .findOne({
        organization: new Types.ObjectId(organizationId),
        status: {
          $in: [SubscriptionStatus.active, SubscriptionStatus.trialing],
        },
      })
      .populate('plan');
  }
}
