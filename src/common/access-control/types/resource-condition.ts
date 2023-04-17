import { UnauthorizedException } from '@nestjs/common';
import { Possession } from './possession';
import { ResourceArgs } from './resource-args';

/**
 * This class represents the conditions for accessing a resource.
 */
export class ResourceConditions {
  /**
   * Creates a new ResourceConditions instance.
   * @param args An array of resource arguments.
   */
  constructor(public args: ResourceArgs[]) {}

  /**
   * Creates a ResourceConditions instance that allows any user to access the resource.
   * @returns A new ResourceConditions instance with an empty array of arguments.
   */
  static any(): ResourceConditions {
    return new ResourceConditions([]);
  }

  /**
   * Creates a ResourceConditions instance that only allows the specified user to access resources they own.
   * @param userId The ID of the user that owns the resource.
   * @returns A new ResourceConditions instance with the specified user ID as an argument.
   */
  static own(userId: string): ResourceConditions {
    return new ResourceConditions([{ userId }]);
  }

  /**
   * Creates a ResourceConditions instance that only allows users to access resources owned by the specified organization.
   * @param resourceArgs An array of resource arguments that include the organization ID.
   * @returns A new ResourceConditions instance with the specified resource arguments.
   */
  static organizationOwn(resourceArgs: ResourceArgs[]): ResourceConditions {
    return new ResourceConditions(resourceArgs);
  }

  /**
   * Converts the ResourceConditions instance to an array of MongoDB find conditions.
   * @param organizationIdField The name of the organization ID field.
   * @param userIdField The name of the user ID field.
   * @returns An array of MongoDB find conditions.
   */
  toMongoFind(
    organizationIdField = 'organizationId',
    userIdField = 'userId',
  ): any {
    const or = this.buildConditions(organizationIdField, userIdField);
    return { $or: or };
  }

  /**
   * Converts the ResourceConditions instance to an array of MongoDB find conditions except for those that only match the user's own resources.
   * @param organizationIdField The name of the organization ID field.
   * @param userIdField The name of the user ID field.
   * @returns An array of MongoDB find conditions.
   */
  toMongoFindNoOwn(
    organizationIdField = 'organizationId',
    userIdField = 'userId',
  ): any {
    const or = this.buildConditions(organizationIdField, userIdField).map(
      (condition) => {
        delete condition[userIdField];
        return condition;
      },
    );
    return { $or: or };
  }

  /**
   * Converts the ResourceConditions instance to a MongoDB find condition for a single resource.
   * @param organizationId The ID of the organization.
   * @param organizationIdField The name of the organization ID field.
   * @param userIdField The name of the user ID field.
   * @returns A MongoDB find condition for a single resource.
   * @throws UnauthorizedException if the user does not have access to the resource.
   */
  toMongoFindOne(
    organizationId: string,
    organizationIdField = 'organizationId',
    userIdField = 'userId',
  ): any {
    const args = this.buildConditions(organizationIdField, userIdField);
    const condition = args.find(
      (arg: any) =>
        arg[organizationIdField].toString() === organizationId.toString(),
    );
    console.log(condition);
    if (!condition) {
      throw new UnauthorizedException(
        'you dont have access to perform this action in this organization',
      );
    }
    return condition;
  }

  /**
   * Converts the ResourceConditions instance to an array of find conditions.
   * @param organizationIdField The name of the organization ID field.
   * @param userIdField The name of the user ID field.
   * @returns An array of find conditions.
   */
  buildConditions(organizationIdField: string, userIdField: string): any[] {
    return this.args.map(({ organizationId, userId, possession }) => {
      const filter: any = {
        [organizationIdField]: organizationId,
      };
      if (possession === Possession.own) {
        filter[userIdField] = userId;
      }
      return filter;
    });
  }
}
