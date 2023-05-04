import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DatabaseModule } from './../../shared/database.module';
import { OrganizationFactory } from './models/organization.model';
import { AccessControlModule } from 'common/access-control/access-control.module';
import { UsersModule } from './../users.module';

@Module({
  imports: [
    DatabaseModule.forFeature([OrganizationFactory]),
    AccessControlModule,
    UsersModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
