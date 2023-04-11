import { Permission } from '../permissions/permission';
import { RoleEnum } from './roles.enum';

// Define Role class
export class RoleAbility {
  permissions: Permission[]; // Declare permissions array
  isDynamic = false;
  constructor(public name: RoleEnum) {
    this.permissions = []; // Initialize permissions array
  }

  // Method to add permissions
  makeDynamic() {
    this.isDynamic = true;
    return this;
  }

  can(permission: Permission) {
    this.permissions.push(permission);
    return this;
  }

  canAllOwn(resource: string) {
    return this.canAll(resource, 'own');
  }

  canAllAny(resource: string) {
    return this.canAll(resource, 'any');
  }

  private canAll(resource: string, possession: 'own' | 'any') {
    this.permissions.push(
      Permission.fromString(`${resource}:read:${possession}`),
    );
    this.permissions.push(
      Permission.fromString(`${resource}:create:${possession}`),
    );
    this.permissions.push(
      Permission.fromString(`${resource}:update:${possession}`),
    );
    this.permissions.push(
      Permission.fromString(`${resource}:update:${possession}`),
    );
    return this;
  }
}
