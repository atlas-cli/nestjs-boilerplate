import { Possession } from './possession';

/**
 * This class represents the arguments required for accessing a resource.
 */
export class ResourceArgs {
  /**
   * The ID of the organization that owns the resource.
   */
  organizationId?: string;

  /**
   * The ID of the user attempting to access the resource.
   */
  userId?: string;

  /**
   * The possession of the user. It can be 'own', 'any' or false if it is not applicable.
   */
  possession?: Possession | false;
}
