import { Module } from '@nestjs/common';
import { StatusSeedService } from './status-seed.service';

@Module({
  providers: [StatusSeedService],
  exports: [StatusSeedService],
})
export class StatusSeedModule {}
