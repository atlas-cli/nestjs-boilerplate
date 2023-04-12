import { Module } from '@nestjs/common';
import { DatabaseModule } from 'shared/database.module';
import { UserFactory } from './../../users/models/user.model';
import { UserProfileRule } from './rules/user-profile.rule';

@Module({
  imports: [DatabaseModule.forFeatureAsync([UserFactory])],
  providers: [UserProfileRule],
  exports: [UserProfileRule],
})
export class AccessControlModule {}
