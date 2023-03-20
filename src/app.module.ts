import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
