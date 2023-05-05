import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Action } from './../common/access-control/types/action';
import { AccessControlGuard } from '../common/access-control/access-control.guard';
import { MongooseSerializerInterceptor } from '../common/interceptors/mongoose/serializer.interceptor';
import { Plan } from './models/plan.model';
import { Subscription } from './models/subscription.model';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UseAbility } from './../common/access-control/decorators/use-ability.decorator';
import { ResourceConditions } from './../common/access-control/types/resource-condition';
import { ResourceCondition } from './../common/access-control/decorators/resource-condition.decorator';
import Stripe from 'stripe';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), AccessControlGuard)
@UseInterceptors(
  MongooseSerializerInterceptor(Plan),
  MongooseSerializerInterceptor(Subscription),
)
@ApiTags('Subscriptions')
@Controller({
  path: 'subscriptions',
  version: '1',
})
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('create')
  @UseAbility('subscription', Action.create)
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    // valid have access to subscription of this organization
    resource.toMongoFindOne(createSubscriptionDto.organizationId, '_id');

    // create if not exists organization with customer in stripe
    const stripeCustomerId =
      await this.subscriptionsService.createStripeOrganizationCustomer(
        createSubscriptionDto.organizationId,
      );

    // get active subscriptions
    const { data } = await this.subscriptionsService.listStripeSubscriptions(
      stripeCustomerId,
    );

    // Se ele ja possui uma assinatura gratuita ativa não pode criar uma assinatura trial
    const haveFreeSubscriptionActive = data.some((subscription) => {
      return (
        subscription.status === 'active' && subscription.metadata.planId === '0'
      );
    });
    if (haveFreeSubscriptionActive && createSubscriptionDto.planId === 0) {
      throw new BadRequestException(
        'you already have an active free subscription',
      );
    }

    // Se ele ja possui uma assinatura paga ativa não pode criar uma assinatura
    const havePaidSubscriptionActive = data.some((subscription) => {
      return (
        (subscription.status === 'active' ||
          subscription.status === 'trialing') &&
        subscription.metadata.planId !== '0'
      );
    });
    if (havePaidSubscriptionActive) {
      throw new BadRequestException(
        'you already have an active subscription please make update',
      );
    }
    // busca todas as assinaturas pendentes de pagamento e cancela elas para poder criar uma nova
    const pendingSubscriptions = data.filter(
      (subscription) => subscription.status === 'incomplete',
    );
    await this.subscriptionsService.cancelSubscriptions(
      pendingSubscriptions.map((subscription) => subscription.id),
    );

    // build subscription itens and quantity
    const items = await this.subscriptionsService.buildItems(
      createSubscriptionDto,
    );

    // create subscription in stripe
    const subscription = await this.subscriptionsService.createSubscription(
      createSubscriptionDto,
      stripeCustomerId,
      createSubscriptionDto.organizationId,
      items,
    );
    // console.log('subscription', subscription);
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    let clientSecret;
    if (invoice.payment_intent !== null) {
      clientSecret = (invoice.payment_intent as Stripe.PaymentIntent)
        .client_secret;
    }

    const response: any = {
      subscriptionId: subscription.id,
      clientSecret,
    };
    if (invoice.payment_intent !== null) {
      response.paymentIntent = (
        invoice.payment_intent as Stripe.PaymentIntent
      ).id;
    }
    return response;
  }

  @Get('active/:id')
  @UseAbility('subscription', Action.read)
  async activeSubscription(
    @Param('id') organizationId: string,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    resource.toMongoFindOne(organizationId, '_id');
    return await this.subscriptionsService.getActiveSubscription(
      organizationId,
    );
  }

  @Put('update')
  @UseAbility('subscription', Action.update)
  async updateSubscription(
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    // valid have access to subscription of this organization
    resource.toMongoFindOne(updateSubscriptionDto.organizationId, '_id');

    const currentSubscription =
      await this.subscriptionsService.getActiveSubscription(
        updateSubscriptionDto.organizationId,
      );

    if (currentSubscription === undefined) {
      throw new BadRequestException(
        'you dont have paid subscription to update',
      );
    }

    const items = await this.subscriptionsService.buildItems(
      updateSubscriptionDto,
    );

    await this.subscriptionsService.updateStripeSubscription(
      currentSubscription.stripeSubscriptionId,
      updateSubscriptionDto,
      items,
    );
  }

  @Delete('cancel')
  @UseAbility('subscription', Action.delete)
  async cancelSubscription(
    @Body() cancelSubscriptionDto: CancelSubscriptionDto,
    @ResourceCondition() resource: ResourceConditions,
  ) {
    const subscriptionId = cancelSubscriptionDto.subscriptionId;
    const { stripeSubscriptionId, organization, plan } =
      await this.subscriptionsService.getSubscription(subscriptionId);

    // valid have permission to cancel for this organization
    resource.toMongoFindOne(organization.toString(), '_id');

    // if is free plan you cannot cancel a subscription
    if (plan === 0) {
      throw new BadRequestException('you cannot cancel free subscription');
    }
    await this.subscriptionsService.cancelStripeSubscriptionOnPeriodEnd(
      stripeSubscriptionId,
    );
  }
}
