import { Module } from '@nestjs/common';
import { RoleSeedService } from './role-seed.service';

@Module({
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
