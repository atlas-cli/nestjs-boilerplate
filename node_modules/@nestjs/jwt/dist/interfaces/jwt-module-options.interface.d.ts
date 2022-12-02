/// <reference types="node" />
import { ModuleMetadata, Type } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
export declare enum JwtSecretRequestType {
    SIGN = 0,
    VERIFY = 1
}
export interface JwtModuleOptions {
    signOptions?: jwt.SignOptions;
    secret?: string | Buffer;
    publicKey?: string | Buffer;
    privateKey?: jwt.Secret;
    secretOrPrivateKey?: jwt.Secret;
    secretOrKeyProvider?: (requestType: JwtSecretRequestType, tokenOrPayload: string | object | Buffer, options?: jwt.VerifyOptions | jwt.SignOptions) => jwt.Secret;
    verifyOptions?: jwt.VerifyOptions;
}
export interface JwtOptionsFactory {
    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions;
}
export interface JwtModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<JwtOptionsFactory>;
    useClass?: Type<JwtOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions;
    inject?: any[];
}
export interface JwtSignOptions extends jwt.SignOptions {
    secret?: string | Buffer;
    privateKey?: string | Buffer;
}
export interface JwtVerifyOptions extends jwt.VerifyOptions {
    secret?: string | Buffer;
    publicKey?: string | Buffer;
}
