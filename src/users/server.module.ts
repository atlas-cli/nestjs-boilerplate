import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    SharedModule,
    UsersModule,
  ],
})
export class UsersServerModule {}
