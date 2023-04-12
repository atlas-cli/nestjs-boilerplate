import { SetMetadata } from '@nestjs/common';
import { Actions } from '../types/actions';
import { Permission } from '../types/permission';
import { Possession } from '../types/possession';

export const ABILITIES_KEY = 'abilities';
export const UseAbility = (resource: any, action: Actions) =>
  SetMetadata(ABILITIES_KEY, new Ability(resource, action));

export class Ability {
  constructor(public resource: any, public action: Actions) {}
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
    return ability.possesion;
  }
}
