import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IsExist } from './../common/utils/validators/is-exists.validator';
import { IsNotExist } from './../common/utils/validators/is-not-exists.validator';
import { DatabaseModule } from 'shared/database.module';
import { UserFactory } from './models/user.model';
import { AccessControlModule } from './../common/access-control/access-control.module';

@Module({
  imports: [DatabaseModule.forFeatureAsync([UserFactory]), AccessControlModule],
  controllers: [UsersController],
  providers: [IsExist, IsNotExist, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
