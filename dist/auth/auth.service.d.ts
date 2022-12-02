import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { UsersService } from './../users/users.service';
import { ForgotService } from './forgot/forgot.service';
import { MailService } from './../common/mail/mail.service';
export declare class AuthService {
    private jwtService;
    private usersService;
    private forgotService;
    private mailService;
    constructor(jwtService: JwtService, usersService: UsersService, forgotService: ForgotService, mailService: MailService);
    validateLogin(loginDto: AuthEmailLoginDto, onlyAdmin: boolean): Promise<{
        token: string;
        user: User;
    }>;
    register(dto: AuthRegisterLoginDto): Promise<void>;
    confirmEmail(hash: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(hash: string, password: string): Promise<void>;
    me(user: User): Promise<User>;
    update(user: User, userDto: AuthUpdateDto): Promise<User>;
    softDelete(user: User): Promise<void>;
}
