import { SetMetadata } from '@nestjs/common';
import { Action } from '../types/action';
import { RouteAbility } from '../types/route-ability';

/**
 * The metadata key for the `UseAbility` decorator.
 */
export const ABILITIES_KEY = 'abilities';

/**
 * A decorator to define the resource and action required to access a route.
 *
 * @param resource - The resource required to access the route.
 * @param action - The action required to access the route.
 */
export const UseAbility = (resource: any, action: Action) =>
  SetMetadata(ABILITIES_KEY, new RouteAbility(resource, action));
