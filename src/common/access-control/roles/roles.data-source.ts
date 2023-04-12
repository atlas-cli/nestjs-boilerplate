import { RoleAbility } from './roles.ability';
import { RoleEnum } from './roles.enum';

export class RolesDataSource {
  // Method to get roles
  static getRoles() {
    // Create guest role with permissions to read and delete profile
    const guest = new RoleAbility(RoleEnum.guest);

    // Create user role with permissions to read and delete profile
    const user = new RoleAbility(RoleEnum.user).canAllOwn('profile');

    // Create admin role with permissions to read and delete profile
    const admin = new RoleAbility(RoleEnum.admin);

    // Create admin role with permissions to read and delete profile
    const student = new RoleAbility(RoleEnum.student).makeDynamic();

    // Create teacher role with permissions to read and delete profile
    const teacher = new RoleAbility(RoleEnum.teacher).makeDynamic();

    // Return array of all roles
    return [guest, admin, user, student, teacher];
  }
}
