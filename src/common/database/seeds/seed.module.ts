import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './../../config/app.config';
import databaseConfig from './../../config/database.config';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
  ],
})
export class SeedModule {}
