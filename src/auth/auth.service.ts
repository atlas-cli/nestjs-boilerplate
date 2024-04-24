import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import * as crypto from 'crypto';
import { plainToClass } from 'class-transformer';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from './../users/users.service';
import { ForgotService } from './forgot/forgot.service';
import { MailService } from './../common/mail/mail.service';
import { RoleEnum } from './../common/roles/roles.enum';
import { StatusEnum } from './../common/statuses/statuses.enum';
import { Role } from './../common/roles/entities/role.entity';
import { Status } from './../common/statuses/entities/status.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
    private configService: ConfigService,
  ) { }

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isValidPassword) {
      const accessToken = await this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      return { accessToken, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            // NOSONAR
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async buildAccessToken(id: number) {
    const user = await this.usersService.findOne({
      id,
    });

    return await this.jwtService.sign({
      id: user.id,
      sub: user.id.toString(),
      email: user.email,
    });
  }

  async register(dto: AuthRegisterLoginDto): Promise<any> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      } as Role,
      status: {
        id: StatusEnum.inactive,
      } as Status,
      hash,
    });

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash,
      },
    });
    if (this.configService.get('app.nodeEnv') !== 'production') {
      // JUST FOR TESTS
      return { hash };
    }
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOne({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = plainToClass(Status, {
      id: StatusEnum.active,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotService.create({
        hash,
        user,
      });

      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash,
        },
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne({
      where: {
        hash,
      },
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = forgot.user;
    user.password = password;
    await user.save();
    await this.forgotService.softDelete(forgot.id);
  }

  async me(user: User): Promise<User> {
    return this.usersService.findOne({
      id: user.id,
    });
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersService.findOne({
          id: user.id,
        });

        const isValidOldPassword = await bcrypt.compare(
          userDto.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    await this.usersService.update(user.id, userDto);

    return this.usersService.findOne({
      id: user.id,
    });
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }
}
