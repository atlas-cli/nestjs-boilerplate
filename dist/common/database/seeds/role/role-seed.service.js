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
exports.RoleSeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("./../../../roles/entities/role.entity");
const roles_enum_1 = require("./../../../roles/roles.enum");
const typeorm_2 = require("typeorm");
let RoleSeedService = class RoleSeedService {
    constructor(repository) {
        this.repository = repository;
    }
    async run() {
        const countUser = await this.repository.count({
            where: {
                id: roles_enum_1.RoleEnum.user,
            },
        });
        if (countUser === 0) {
            await this.repository.save(this.repository.create({
                id: roles_enum_1.RoleEnum.user,
                name: 'User',
            }));
        }
        const countAdmin = await this.repository.count({
            where: {
                id: roles_enum_1.RoleEnum.admin,
            },
        });
        if (countAdmin === 0) {
            await this.repository.save(this.repository.create({
                id: roles_enum_1.RoleEnum.admin,
                name: 'Admin',
            }));
        }
    }
};
RoleSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RoleSeedService);
exports.RoleSeedService = RoleSeedService;
//# sourceMappingURL=role-seed.service.js.map