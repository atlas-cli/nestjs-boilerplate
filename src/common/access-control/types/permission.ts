import { Action } from './action';
import { Possession } from './possession';

/**
 * Represents a permission of a role, consisting of a resource, an action, and a possession.
 */
export class Permission {
  /** The string used to separate the resource, action, and possession when converting to/from a string. */
  static readonly DIVIDER = ':';

  /**
   * Creates a new permission.
   * @param resource The resource associated with the permission.
   * @param action The action associated with the permission.
   * @param possession The possession associated with the permission.
   */
  constructor(
    public resource: string,
    public action: Action,
    public possession: Possession,
  ) {}

  /**
   * Converts the permission to a string.
   * @returns A string representation of the permission.
   */
  toString(): string {
    return [this.resource, this.action, this.possession].join(
      Permission.DIVIDER,
    );
  }

  /**
   * Creates a new permission from a string.
   * @param name The string representation of the permission.
   * @returns A new permission object.
   * @throws An error if the string is invalid or missing any of the required components.
   */
  static fromString(name: string): Permission {
    if (name === undefined) {
      throw new Error('name is not defined');
    }
    const props = name.split(Permission.DIVIDER);
    if (props.length !== 3) {
      throw new Error('missing permission props');
    }
    const [resource, action, possession] = props;
    const actionEnum = Action[action];
    const possessionEnum = Possession[possession];
    if (actionEnum === undefined) {
      throw new Error('action props not have correct value');
    }
    if (possessionEnum === undefined) {
      throw new Error('possession props not have correct value');
    }
    return new Permission(resource, actionEnum, possessionEnum);
  }
}
