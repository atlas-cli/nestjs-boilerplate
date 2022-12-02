import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
export declare class AuthController {
    service: AuthService;
    constructor(service: AuthService);
    login(loginDto: AuthEmailLoginDto): Promise<{
        token: string;
        user: import("../users/entities/user.entity").User;
    }>;
    adminLogin(loginDTO: AuthEmailLoginDto): Promise<{
        token: string;
        user: import("../users/entities/user.entity").User;
    }>;
    register(createUserDto: AuthRegisterLoginDto): Promise<void>;
    confirmEmail(confirmEmailDto: AuthConfirmEmailDto): Promise<void>;
    forgotPassword(forgotPasswordDto: AuthForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void>;
    me(request: any): Promise<import("../users/entities/user.entity").User>;
    update(request: any, userDto: AuthUpdateDto): Promise<import("../users/entities/user.entity").User>;
    delete(request: any): Promise<void>;
}
