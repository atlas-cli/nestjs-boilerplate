import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import stripeConfig from './../../config/stripe.config';
import { DatabaseModule } from 'shared/database.module';
import appConfig from './../../config/app.config';
import databaseConfig from './../../config/database.config';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { PlanSeedModule } from './plan/plan-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import { ProductSeedModule } from './product/product-seed.module';
import authConfig from './../../../common/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, authConfig, stripeConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule.forRoot(),
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    PlanSeedModule,
    ProductSeedModule,
  ],
})
export class SeedModule {}
