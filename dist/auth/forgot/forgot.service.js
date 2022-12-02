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
exports.ForgotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const forgot_entity_1 = require("./entities/forgot.entity");
let ForgotService = class ForgotService {
    constructor(forgotRepository) {
        this.forgotRepository = forgotRepository;
    }
    async findOne(options) {
        return this.forgotRepository.findOne({
            where: options.where,
        });
    }
    async findMany(options) {
        return this.forgotRepository.find({
            where: options.where,
        });
    }
    async create(data) {
        return this.forgotRepository.save(this.forgotRepository.create(data));
    }
    async softDelete(id) {
        await this.forgotRepository.softDelete(id);
    }
};
ForgotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(forgot_entity_1.Forgot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ForgotService);
exports.ForgotService = ForgotService;
//# sourceMappingURL=forgot.service.js.map