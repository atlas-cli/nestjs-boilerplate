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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieResolver = void 0;
const cookie = require("cookie");
const common_1 = require("@nestjs/common");
const i18n_resolver_options_decorator_1 = require("../decorators/i18n-resolver-options.decorator");
let CookieResolver = class CookieResolver {
    constructor(cookieNames = ['lang']) {
        this.cookieNames = cookieNames;
    }
    resolve(context) {
        let req;
        switch (context.getType()) {
            case 'http':
                req = context.switchToHttp().getRequest();
                req = req.raw ? req.raw : req;
                break;
            case 'graphql':
                [, , { req }] = context.getArgs();
                break;
        }
        if (req) {
            if (!req.cookies && req.headers.cookie) {
                req.cookies = cookie.parse(req.headers.cookie);
            }
            if (req.cookies) {
                for (const i in this.cookieNames) {
                    if (req.cookies[this.cookieNames[i]]) {
                        return req.cookies[this.cookieNames[i]];
                    }
                }
            }
        }
        return undefined;
    }
};
CookieResolver = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, i18n_resolver_options_decorator_1.I18nResolverOptions)()),
    __metadata("design:paramtypes", [Array])
], CookieResolver);
exports.CookieResolver = CookieResolver;
//# sourceMappingURL=cookie.resolver.js.map