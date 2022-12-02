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
exports.AcceptLanguageResolver = void 0;
const index_1 = require("../index");
const common_1 = require("@nestjs/common");
const accept_language_parser_1 = require("accept-language-parser");
let AcceptLanguageResolver = class AcceptLanguageResolver {
    constructor(options = {
        matchType: 'strict-loose',
    }) {
        this.options = options;
    }
    async resolve(context) {
        var _a, _b, _c;
        let req;
        let service;
        switch (context.getType()) {
            case 'http':
                req = context.switchToHttp().getRequest();
                service = req.i18nService;
                break;
            case 'graphql':
                [, , { req, i18nService: service }] = context.getArgs();
                if (!req)
                    return undefined;
                break;
            default:
                return undefined;
        }
        const lang = req.raw
            ? (_a = req.raw.headers) === null || _a === void 0 ? void 0 : _a['accept-language']
            : (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b['accept-language'];
        if (lang) {
            const supportedLangs = service.getSupportedLanguages();
            if (this.options.matchType === 'strict') {
                return (0, accept_language_parser_1.pick)(supportedLangs, lang);
            }
            else if (this.options.matchType === 'loose') {
                return (0, accept_language_parser_1.pick)(supportedLangs, lang, { loose: true });
            }
            return ((_c = (0, accept_language_parser_1.pick)(supportedLangs, lang)) !== null && _c !== void 0 ? _c : (0, accept_language_parser_1.pick)(supportedLangs, lang, { loose: true }));
        }
        return lang;
    }
};
AcceptLanguageResolver = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, index_1.I18nResolverOptions)()),
    __metadata("design:paramtypes", [Object])
], AcceptLanguageResolver);
exports.AcceptLanguageResolver = AcceptLanguageResolver;
//# sourceMappingURL=accept-language.resolver.js.map