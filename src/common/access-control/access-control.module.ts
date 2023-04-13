import { Module } from '@nestjs/common';
import { DatabaseModule } from './../../shared/database.module';
import { UserFactory } from './../../users/models/user.model';
import { UserAccessControlRule } from './rules/user-access-control.rule';

@Module({
  imports: [DatabaseModule.forFeatureAsync([UserFactory])],
  providers: [UserAccessControlRule],
  exports: [UserAccessControlRule],
})
export class AccessControlModule {}
