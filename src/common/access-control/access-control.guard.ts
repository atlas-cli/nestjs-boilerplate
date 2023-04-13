import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITIES_KEY } from './decorators/use-ability.decorator';
import { UserAccessControlRule } from './rules/user-access-control.rule';
import { ResourceConditions } from './types/resource-condition';
import { Permission } from './types/permission';
import { RouteAbility } from './types/route-ability';
import { ResourceArgs } from './types/resource-args';

/**
 * Access control guard that verifies abilities required per routes and validates user access permissions.
 */
@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userAccessControlRule: UserAccessControlRule,
  ) {}

  /**
   * Checks if the user has the required permissions to access the route.
   * @param context The execution context.
   * @returns A boolean indicating whether the user has access to the route or not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ability = this.reflector.getAllAndOverride<RouteAbility>(
      ABILITIES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (ability === undefined) {
      // no route ability required
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (request.user === undefined) {
      // if you not use AuthGuard before, you dont have user object
      throw new BadRequestException(
        'You need to add AuthGuard to use access control.',
      );
    }

    const userId = request.user._id;
    const { userPermissions, userOrganizationRoles } =
      await this.userAccessControlRule.transform(userId);

    const haveAbility = this.validateUserPermissions(
      ability,
      userPermissions,
      request,
    );

    if (haveAbility) {
      return true;
    }

    const organizationResources = Object.keys(userOrganizationRoles)
      .map((organizationId): ResourceArgs => {
        const permissions = userOrganizationRoles[organizationId];
        const possession = ability.hasAbility(permissions);
        return { organizationId, userId, possession };
      })
      .filter(({ possession }) => possession !== false);

    if (organizationResources.length > 0) {
      const resourceConditions = ResourceConditions.organizationOwn(
        organizationResources,
      );
      request.resourceConditions = resourceConditions;
      return true;
    }

    return false;
  }
  /**
   * Validates the user's permissions against the required abilities.
   * @param routeAbility The required ability to access the route.
   * @param userPermissions The user's permissions.
   * @param request The HTTP request.
   * @returns A boolean indicating whether the user has the required permissions or not
   **/
  validateUserPermissions(
    routeAbility: RouteAbility,
    userPermissions: Permission[],
    request: any,
  ) {
    const condition = routeAbility.hasAbility(userPermissions);

    if (condition !== false) {
      const own = ResourceConditions.own(request.user._id);
      const any = ResourceConditions.any();

      const resourceConditions = condition === 'own' ? own : any;
      request.resourceConditions = resourceConditions;

      return true;
    }
    return false;
  }
}
