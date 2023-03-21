import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SharedModule, DatabaseModule.forRoot(), UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
