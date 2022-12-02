"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const random_string_generator_util_1 = require("@nestjs/common/utils/random-string-generator.util");
const crypto = require("crypto");
const class_transformer_1 = require("class-transformer");
const auth_providers_enum_1 = require("./auth-providers.enum");
const users_service_1 = require("./../users/users.service");
const forgot_service_1 = require("./forgot/forgot.service");
const mail_service_1 = require("./../common/mail/mail.service");
const roles_enum_1 = require("./../common/roles/roles.enum");
const statuses_enum_1 = require("./../common/statuses/statuses.enum");
const status_entity_1 = require("./../common/statuses/entities/status.entity");
let AuthService = class AuthService {
    constructor(jwtService, usersService, forgotService, mailService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.forgotService = forgotService;
        this.mailService = mailService;
    }
    async validateLogin(loginDto, onlyAdmin) {
        const user = await this.usersService.findOne({
            email: loginDto.email,
        });
        if (!user ||
            (user &&
                !(onlyAdmin ? [roles_enum_1.RoleEnum.admin] : [roles_enum_1.RoleEnum.user]).includes(user.role.id))) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'notFound',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (user.provider !== auth_providers_enum_1.AuthProvidersEnum.email) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: `needLoginViaProvider:${user.provider}`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
        if (isValidPassword) {
            const token = await this.jwtService.sign({
                id: user.id,
                role: user.role,
            });
            return { token, user: user };
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: 'incorrectPassword',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    async register(dto) {
        const hash = crypto
            .createHash('sha256')
            .update((0, random_string_generator_util_1.randomStringGenerator)())
            .digest('hex');
        const user = await this.usersService.create(Object.assign(Object.assign({}, dto), { email: dto.email, role: {
                id: roles_enum_1.RoleEnum.user,
            }, status: {
                id: statuses_enum_1.StatusEnum.inactive,
            }, hash }));
        await this.mailService.userSignUp({
            to: user.email,
            data: {
                hash,
            },
        });
    }
    async confirmEmail(hash) {
        const user = await this.usersService.findOne({
            hash,
        });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: `notFound`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        user.hash = null;
        user.status = (0, class_transformer_1.plainToClass)(status_entity_1.Status, {
            id: statuses_enum_1.StatusEnum.active,
        });
        await user.save();
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOne({
            email,
        });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'emailNotExists',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        else {
            const hash = crypto
                .createHash('sha256')
                .update((0, random_string_generator_util_1.randomStringGenerator)())
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
    async resetPassword(hash, password) {
        const forgot = await this.forgotService.findOne({
            where: {
                hash,
            },
        });
        if (!forgot) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `notFound`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const user = forgot.user;
        user.password = password;
        await user.save();
        await this.forgotService.softDelete(forgot.id);
    }
    async me(user) {
        return this.usersService.findOne({
            id: user.id,
        });
    }
    async update(user, userDto) {
        if (userDto.password) {
            if (userDto.oldPassword) {
                const currentUser = await this.usersService.findOne({
                    id: user.id,
                });
                const isValidOldPassword = await bcrypt.compare(userDto.oldPassword, currentUser.password);
                if (!isValidOldPassword) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                        errors: {
                            oldPassword: 'incorrectOldPassword',
                        },
                    }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                }
            }
            else {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'missingOldPassword',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        await this.usersService.update(user.id, userDto);
        return this.usersService.findOne({
            id: user.id,
        });
    }
    async softDelete(user) {
        await this.usersService.softDelete(user.id);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        forgot_service_1.ForgotService,
        mail_service_1.MailService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map