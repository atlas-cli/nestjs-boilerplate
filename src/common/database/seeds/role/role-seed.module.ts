import { Module } from '@nestjs/common';
import { RoleFactory } from './../../../roles/models/role.model';
import { DatabaseModule } from 'shared/database.module';
import { RoleSeedService } from './role-seed.service';

@Module({
  imports: [DatabaseModule.forFeature([RoleFactory])],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
