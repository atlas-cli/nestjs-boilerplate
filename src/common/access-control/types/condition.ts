import { Possession } from './possession';

export class Condition {
  constructor(public args: any) {}

  static any() {
    return new Condition({});
  }
  static fromOrganization({
    organizationId,
    userId,
    possession,
  }: {
    organizationId: string;
    userId: string;
    possession: Possession;
  }) {
    if (possession === Possession.any) {
      return new Condition({
        organizationId,
      });
    }
    return new Condition({
      organizationId,
      userId,
    });
  }
}
