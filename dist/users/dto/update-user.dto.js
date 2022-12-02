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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./create-user.dto");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const is_not_exists_validator_1 = require("../../common/utils/validators/is-not-exists.validator");
const role_entity_1 = require("../../common/roles/entities/role.entity");
const is_exists_validator_1 = require("../../common/utils/validators/is-exists.validator");
const status_entity_1 = require("../../common/statuses/entities/status.entity");
class UpdateUserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'test1@example.com' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.toLowerCase().trim()),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(is_not_exists_validator_1.IsNotExist, ['User'], {
        message: 'emailAlreadyExists',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'John' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ example: 'Doe' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ type: role_entity_1.Role }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(is_exists_validator_1.IsExist, ['Role', 'id'], {
        message: 'roleNotExists',
    }),
    __metadata("design:type", role_entity_1.Role)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ type: status_entity_1.Status }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Validate)(is_exists_validator_1.IsExist, ['Status', 'id'], {
        message: 'statusNotExists',
    }),
    __metadata("design:type", status_entity_1.Status)
], UpdateUserDto.prototype, "status", void 0);
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user.dto.js.map