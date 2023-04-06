import { Module } from '@nestjs/common';
import { ForgotFactory } from './models/forgot.model';
import { ForgotService } from './forgot.service';
import { DatabaseModule } from 'shared/database.module';

@Module({
  imports: [DatabaseModule.forFeature([ForgotFactory])],
  providers: [ForgotService],
  exports: [ForgotService],
})
export class ForgotModule {}
