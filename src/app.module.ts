import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './users/organizations/organizations.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule.forRoot(),
    UsersModule,
    OrganizationsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
