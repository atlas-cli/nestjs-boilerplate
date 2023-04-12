import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../users/models/user.model';
import { RolesDataSource } from '../roles/roles.data-source';
import { Permission } from '../types/permission';

@Injectable()
export class UserProfileRule {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async transform(userId: string) {
    const user = await this.userModel.findById(userId, {
      roles: true,
    });
    const rolesAbilities = RolesDataSource.getRoles();

    const userPermissions = user.roles
      .filter((role) => role.organizationId === undefined)
      .reduce((prev, { role }) => {
        const permissions = rolesAbilities.find(
          (roleAbility) => roleAbility.name === role,
        ).permissions;
        return [...prev, ...permissions];
      }, []);

    const organizationsPermissions = user.roles
      .filter((role) => role.organizationId !== undefined)
      .reduce((prev, role) => {
        prev[role.organizationId.toString()] = role.permissions.map(
          (permission) => Permission.fromString(permission),
        );
        return prev;
      }, {});

    return {
      userPermissions,
      organizationsPermissions,
    };
  }
}
