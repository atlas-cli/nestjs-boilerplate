import { Module } from '@nestjs/common';
import { DatabaseModule } from '../shared/database.module';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsModule } from './subscriptions.module';

@Module({
  imports: [SharedModule, DatabaseModule.forRoot(), SubscriptionsModule],
})
export class SubscriptionsServerModule {}
