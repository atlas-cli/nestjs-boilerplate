import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { IsExist } from './../common/utils/validators/is-exists.validator';
import { IsNotExist } from './../common/utils/validators/is-not-exists.validator';
import { ForgotModule } from './forgot/forgot.module';
import { MailModule } from './../common/mail/mail.module';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
    UsersModule,
    ForgotModule,
    PassportModule,
    MailModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [IsExist, IsNotExist, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
