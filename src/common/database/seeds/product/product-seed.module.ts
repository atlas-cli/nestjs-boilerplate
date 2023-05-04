import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../../shared/database.module';
import { ProductFactory } from '../../../../subscriptions/models/product.model';
import { StripeSharedModule } from '../../../../subscriptions/webhooks/stripe/stripe.module';
import { ProductSeedService } from './product-seed.service';

@Module({
  imports: [DatabaseModule.forFeature([ProductFactory]), StripeSharedModule],
  providers: [ProductSeedService],
  exports: [ProductSeedService],
})
export class ProductSeedModule {}
