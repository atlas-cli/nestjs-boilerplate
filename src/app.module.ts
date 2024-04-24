import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './shared/database.module';
import { User } from './users/entities/user.entity';
import { Role } from './common/roles/entities/role.entity';
import { Status } from './common/statuses/entities/status.entity';
import { Forgot } from './auth/forgot/entities/forgot.entity';
import { OidcModule } from './auth/oidc/oidc.module';

/**
 * AppModule is the main module of the application.
 * It imports the SharedModule, DatabaseModule, UsersModule, and AuthModule.
 * The DatabaseModule is configured with the entities of the application.
 */
@Module({
  imports: [
    SharedModule,
    DatabaseModule.forRoot([User, Role, Status, Forgot]),
    UsersModule,
    AuthModule,
    OidcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }