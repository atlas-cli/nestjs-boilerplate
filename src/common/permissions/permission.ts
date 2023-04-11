import { PermissionAction } from './action';
import { PermissionPosession } from './possession';

export class Permission {
  static divider = ':'; // Define divider for string representation of permission

  // Constructor to create a new permission
  constructor(
    private resource: string,
    private action: PermissionAction,
    private possesion: PermissionPosession,
  ) {}

  // Method to convert permission to string
  toString(): string {
    return [this.resource, this.action, this.possesion].join(
      Permission.divider,
    );
  }

  // Method to create a new permission from string
  static fromString(name: string) {
    if (name === undefined) {
      throw new Error('name is not defined');
    }
    const props = name.split(this.divider);
    if (props.length !== 3) {
      throw new Error('missing permission props');
    }
    const [resource, action, possesion] = props;
    const actionEnum = PermissionAction[action];
    const possesionEnum = PermissionPosession[possesion];
    if (actionEnum === undefined) {
      throw new Error('action props not have correct value');
    }
    if (possesionEnum === undefined) {
      throw new Error('possesion props not have correct value');
    }
    return new Permission(resource, actionEnum, possesionEnum);
  }
}
