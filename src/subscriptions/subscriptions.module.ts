import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { IsExist } from '../common/utils/validators/is-exists.validator';
import { IsNotExist } from '../common/utils/validators/is-not-exists.validator';
import { DatabaseModule } from 'shared/database.module';
import { PlanFactory } from './models/plan.model';
import { AccessControlModule } from '../common/access-control/access-control.module';
import { StripeSharedModule } from './webhooks/stripe/stripe.module';
import { UsersModule } from './../users/users.module';
import { ProductFactory } from './models/product.model';
import { OrganizationsModule } from 'users/organizations/organizations.module';
import { SubscriptionFactory } from './models/subscription.model';
import { StripeHandlersService } from './webhooks/stripe/stripe-handler.service';
import { PlansController } from './plans/plans.controller';
import { PlansService } from './plans/plans.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      PlanFactory,
      ProductFactory,
      SubscriptionFactory,
    ]),
    StripeSharedModule,
    AccessControlModule,
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [SubscriptionsController, PlansController],
  providers: [
    IsExist,
    IsNotExist,
    SubscriptionsService,
    PlansService,
    StripeHandlersService,
  ],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
