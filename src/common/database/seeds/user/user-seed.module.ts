import { Module } from '@nestjs/common';
import { DatabaseModule } from 'shared/database.module';
import { UserFactory } from '../../../../users/models/user.model';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [DatabaseModule.forFeatureAsync([UserFactory])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
