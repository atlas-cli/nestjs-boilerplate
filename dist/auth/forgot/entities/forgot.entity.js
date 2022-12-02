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
exports.Forgot = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./../../../users/entities/user.entity");
const class_validator_1 = require("class-validator");
const entity_helper_1 = require("./../../../common/utils/entity-helper");
let Forgot = class Forgot extends entity_helper_1.EntityHelper {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Forgot.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    (0, typeorm_1.Column)(),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Forgot.prototype, "hash", void 0);
__decorate([
    (0, class_validator_1.Allow)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, {
        eager: true,
    }),
    __metadata("design:type", user_entity_1.User)
], Forgot.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Forgot.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Forgot.prototype, "deletedAt", void 0);
Forgot = __decorate([
    (0, typeorm_1.Entity)()
], Forgot);
exports.Forgot = Forgot;
//# sourceMappingURL=forgot.entity.js.map