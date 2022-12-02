"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusSeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const status_entity_1 = require("./../../../statuses/entities/status.entity");
const status_seed_service_1 = require("./status-seed.service");
let StatusSeedModule = class StatusSeedModule {
};
StatusSeedModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([status_entity_1.Status])],
        providers: [status_seed_service_1.StatusSeedService],
        exports: [status_seed_service_1.StatusSeedService],
    })
], StatusSeedModule);
exports.StatusSeedModule = StatusSeedModule;
//# sourceMappingURL=status-seed.module.js.map