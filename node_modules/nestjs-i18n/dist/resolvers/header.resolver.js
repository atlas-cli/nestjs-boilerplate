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
exports.HeaderResolver = void 0;
const common_1 = require("@nestjs/common");
const i18n_resolver_options_decorator_1 = require("../decorators/i18n-resolver-options.decorator");
let HeaderResolver = class HeaderResolver {
    constructor(keys = []) {
        this.keys = keys;
        this.logger = new common_1.Logger('I18nService');
    }
    resolve(context) {
        let req;
        switch (context.getType()) {
            case 'http':
                req = context.switchToHttp().getRequest();
                break;
            case 'graphql':
                [, , { req }] = context.getArgs();
                break;
        }
        let lang;
        if (req) {
            for (const key of this.keys) {
                if (key === 'accept-language') {
                    this.logger.warn('HeaderResolver does not support RFC4647 Accept-Language header. Please use AcceptLanguageResolver instead.');
                }
                if (req.headers !== undefined && req.headers[key] !== undefined) {
                    lang = req.headers[key];
                    break;
                }
            }
        }
        return lang;
    }
};
HeaderResolver = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, i18n_resolver_options_decorator_1.I18nResolverOptions)()),
    __metadata("design:paramtypes", [Array])
], HeaderResolver);
exports.HeaderResolver = HeaderResolver;
//# sourceMappingURL=header.resolver.js.map