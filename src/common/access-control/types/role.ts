import { Permission } from './permission';
import { RoleEnum } from '../roles/roles.enum';

/**
 * Represents a role with a name, a list of permissions, and a flag indicating if the role is an organization role or not.
 */
export class Role {
  /**
   * The list of permissions associated with the role.
   */
  permissions: Permission[] = [];

  /**
   * Indicates whether the role is an organization role or not.
   */
  isOrganizationRole = false;

  /**
   * Creates a new instance of the Role class with the given name.
   * @param name The name of the role.
   */
  constructor(public name: RoleEnum) {}

  /**
   * Marks the role as an organization role.
   * @returns The current instance of the Role class.
   */
  setAsOrganizationRole(): this {
    this.isOrganizationRole = true;
    return this;
  }

  /**
   * Adds a permission to the list of permissions associated with the role.
   * @param permission The permission to add.
   * @returns The current instance of the Role class.
   */
  can(permission: Permission): this {
    this.permissions.push(permission);
    return this;
  }

  /**
   * Adds "read", "create", "update", and "delete" permissions for a given resource and possession type to the list of permissions associated with the role.
   * @param resource The name of the resource.
   * @param possession The possession type ("own" or "any").
   * @returns The current instance of the Role class.
   */
  canAll(resource: string, possession: 'own' | 'any'): this {
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
      Permission.fromString(`${resource}:delete:${possession}`),
    );
    return this;
  }

  /**
   * Adds "read" and "delete" permissions for a given resource and possession type to the list of permissions associated with the role.
   * @param resource The name of the resource.
   * @returns The current instance of the Role class.
   */
  canAllOwn(resource: string): this {
    return this.canAll(resource, 'own');
  }

  /**
   * Adds "read" and "delete" permissions for a given resource to the list of permissions associated with the role.
   * @param resource The name of the resource.
   * @returns The current instance of the Role class.
   */
  canAllAny(resource: string): this {
    return this.canAll(resource, 'any');
  }
}
