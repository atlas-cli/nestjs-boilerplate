"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const forgot_entity_1 = require("./entities/forgot.entity");
const forgot_service_1 = require("./forgot.service");
let ForgotModule = class ForgotModule {
};
ForgotModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([forgot_entity_1.Forgot])],
        providers: [forgot_service_1.ForgotService],
        exports: [forgot_service_1.ForgotService],
    })
], ForgotModule);
exports.ForgotModule = ForgotModule;
//# sourceMappingURL=forgot.module.js.map