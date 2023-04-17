import { Action } from '../types/action';
import { Permission } from '../types/permission';
import { Possession } from '../types/possession';
import { Role } from '../types/role';
import { RoleEnum } from './roles.enum';

/**
 * The RolesBuilder class provides a way to create and manage roles with different permissions.
 */
export class RolesBuilder {
  /**
   * Method to get roles.
   *
   * @returns An array of all roles with their permissions.
   */
  static getRoles(): Role[] {
    // Create guest role with permissions to read and delete profile
    const guest = new Role(RoleEnum.guest);

    // Create user role with permissions to read and delete profile
    const user = new Role(RoleEnum.user)
      .canAllOwn('profile')
      .can(new Permission('organizations', Action.create, Possession.own));

    // Create admin role with permissions to read and delete profile
    const admin = new Role(RoleEnum.admin);

    // Create organization student role
    const student = new Role(RoleEnum.student).setAsOrganizationRole();

    // Create organization teacher role
    const teacher = new Role(RoleEnum.teacher)
      .setAsOrganizationRole()
      .canAllOwn('organizations');

    // Return array of all roles
    return [guest, admin, user, student, teacher];
  }
}
