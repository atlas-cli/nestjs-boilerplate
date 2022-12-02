import { Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
type JwtPayload = Pick<User, 'id' | 'role'> & {
    iat: number;
    exp: number;
};
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    validate(payload: JwtPayload): JwtPayload;
}
export {};
