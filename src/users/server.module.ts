import { Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    // AuthModule,
  ],
})
export class UsersServerModule { }
