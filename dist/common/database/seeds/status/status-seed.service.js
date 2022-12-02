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
exports.StatusSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const status_entity_1 = require("./../../../statuses/entities/status.entity");
const statuses_enum_1 = require("./../../../statuses/statuses.enum");
const typeorm_2 = require("typeorm");
let StatusSeedService = class StatusSeedService {
    constructor(repository) {
        this.repository = repository;
    }
    async run() {
        const count = await this.repository.count();
        if (count === 0) {
            await this.repository.save([
                this.repository.create({
                    id: statuses_enum_1.StatusEnum.active,
                    name: 'Active',
                }),
                this.repository.create({
                    id: statuses_enum_1.StatusEnum.inactive,
                    name: 'Inactive',
                }),
            ]);
        }
    }
};
StatusSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(status_entity_1.Status)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StatusSeedService);
exports.StatusSeedService = StatusSeedService;
//# sourceMappingURL=status-seed.service.js.map