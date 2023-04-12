import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABILITIES_KEY, Ability } from './decorators/use-ability.decorator';
import { UserProfileRule } from './rules/user-profile.rule';
import { Condition } from './types/condition';

@Injectable({})
export class AccessControlGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userProfileRule: UserProfileRule,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean | any> {
    const ability = this.reflector.getAllAndOverride<Ability>(ABILITIES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (ability === undefined) {
      // no ability required
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (request.user === undefined) {
      throw new BadRequestException(
        'you need add AuthGuard to use access control',
      );
    }

    const userId = request.user._id;

    const { userPermissions, organizationsPermissions } =
      await this.userProfileRule.transform(userId);

    const haveAbility = this.validateMyPermissions(
      ability,
      userPermissions,
      request,
    );
    if (haveAbility === true) {
      return true;
    }

    const allowedOrganizations = Object.keys(organizationsPermissions)
      .map((organizationId) => {
        const permissions = organizationsPermissions[organizationId];
        const condition = ability.hasAbility(permissions);
        return { organizationId, userId, condition };
      })
      .filter(({ condition }) => {
        if (condition !== false) {
          return true;
        }
      });

    if (allowedOrganizations.length > 0) {
      request.conditions = allowedOrganizations.map((access: any) =>
        Condition.fromOrganization(access),
      );
      return true;
    }

    return false;
  }
  validateMyPermissions(ability, myPermission, request) {
    const condition = ability.hasAbility(myPermission);

    if (condition !== false) {
      const own = new Condition({
        userId: request.user._id,
      });
      const any = Condition.any();
      request.conditions = [condition === 'own' ? own : any];
      return true;
    }
    return false;
  }
}
