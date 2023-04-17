import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RoleEnum } from './../common/access-control/roles/roles.enum';
import { Model, Types } from 'mongoose';
import { IPaginationOptions } from './../common/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { RolesBuilder } from 'common/access-control/roles/roles.builder';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createProfileDto: CreateUserDto) {
    return this.userModel.create(createProfileDto);
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.userModel.find({
      options: paginationOptions,
    });
  }

  findOne(fields) {
    return this.userModel.findOne(fields);
  }

  updateGrantAccessToOrganization(
    id: Types.ObjectId,
    organizationId: Types.ObjectId,
    roleName: RoleEnum,
  ) {
    // build role permissions
    const roles = RolesBuilder.getRoles();
    const selectedRole = roles.find((role) => role.name === roleName);
    if (selectedRole === undefined) {
      throw new BadRequestException('this role dont exists');
    }
    const permissions = selectedRole.permissions.map((permission) =>
      permission.toString(),
    );

    // insert role in user
    return this.userModel.updateOne(
      {
        _id: id,
      },
      {
        $addToSet: {
          roles: {
            role: roleName,
            organizationId,
            permissions,
          },
        },
      },
    );
  }

  updateDisgraceAccessToOrganization(organizationId: Types.ObjectId) {
    return this.userModel.updateMany(
      {
        'roles.organizationId': organizationId,
      },
      { $pull: { roles: { organizationId: organizationId } } },
    );
  }

  update(id: Types.ObjectId, updateProfileDto: UpdateUserDto) {
    return this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...updateProfileDto,
      },
    );
  }

  async softDelete(id: Types.ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }
}
