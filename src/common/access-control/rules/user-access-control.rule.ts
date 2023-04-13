import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../users/models/user.model';
import { RolesBuilder } from '../roles/roles.builder';
import { Permission } from '../types/permission';

@Injectable()
export class UserAccessControlRule {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Transforms a user's roles into their permissions and organization roles.
   * @param userId The ID of the user to transform.
   * @returns An object containing the user's permissions and organization roles.
   */
  async transform(userId: string): Promise<{
    userPermissions: Permission[];
    userOrganizationRoles: Record<string, Permission[]>;
  }> {
    const user = await this.userModel.findById(userId, {
      roles: true,
    });

    const rolesAbilities = RolesBuilder.getRoles();

    const userPermissions = user.roles
      .filter((role) => role.organizationId === undefined)
      .reduce((prev, { role }) => {
        const permissions = rolesAbilities.find(
          (roleAbility) => roleAbility.name === role,
        ).permissions;
        return [...prev, ...permissions];
      }, []);

    const userOrganizationRoles = user.roles
      .filter((role) => role.organizationId !== undefined)
      .reduce((prev, role) => {
        prev[role.organizationId.toString()] = role.permissions.map(
          (permission) => Permission.fromString(permission),
        );
        return prev;
      }, {});

    return {
      userPermissions,
      userOrganizationRoles,
    };
  }
}
