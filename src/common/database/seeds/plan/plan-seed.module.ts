import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../shared/database.module';
import { PlanFactory } from './../../../../subscriptions/models/plan.model';
import { StripeSharedModule } from '../../../../subscriptions/webhooks/stripe/stripe.module';
import { PlanSeedService } from './plan-seed.service';

@Module({
  imports: [DatabaseModule.forFeature([PlanFactory]), StripeSharedModule],
  providers: [PlanSeedService],
  exports: [PlanSeedService],
})
export class PlanSeedModule {}
