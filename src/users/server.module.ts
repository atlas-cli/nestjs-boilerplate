import { Module } from '@nestjs/common';
import { DatabaseModule } from './../shared/database.module';
import { SharedModule } from '../shared/shared.module';
import { User } from './../users/entities/user.entity';
import { Role } from './../common/roles/entities/role.entity';
import { Status } from './../common/statuses/entities/status.entity';
import { Forgot } from './../auth/forgot/entities/forgot.entity';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule.forRoot([User, Role, Status, Forgot]),
    AuthModule,
  ],
})
export class UsersServerModule {}
