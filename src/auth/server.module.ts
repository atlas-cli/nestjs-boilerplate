import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { DatabaseModule } from '../shared/database.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [SharedModule, DatabaseModule.forRoot(), AuthModule],
})
export class AuthServerModule {}
