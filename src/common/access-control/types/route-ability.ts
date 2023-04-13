import { Action } from './action';
import { Permission } from './permission';
import { Possession } from './possession';

/**
 * Represents a set of permissions required to access a specific route.
 */
export class RouteAbility {
  /**
   * Creates a new RouteAbility instance.
   *
   * @param resource - The resource to which the permissions apply.
   * @param action - The action that the permissions allow or deny.
   */
  constructor(public resource: any, public action: Action) {}

  /**
   * Checks whether the given permissions allow access to the resource and action
   * specified in this RouteAbility instance.
   *
   * @param permissions - The set of permissions to check.
   * @returns The possession associated with the matching permission, or `false` if no matching
   * permission was found.
   */
  hasAbility(permissions: Permission[]): false | Possession {
    const ability = permissions.find((permission) => {
      return (
        permission.resource === this.resource &&
        permission.action === this.action
      );
    });

    if (ability === undefined) {
      return false;
    }

    return ability.possession;
  }
}
