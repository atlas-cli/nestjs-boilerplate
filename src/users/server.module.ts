import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { DatabaseModule } from '../shared/database.module';
import { UsersModule } from './users.module';
import { OrganizationsModule } from './organizations/organizations.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule.forRoot(),
    UsersModule,
    OrganizationsModule,
  ],
})
export class UsersServerModule {}
