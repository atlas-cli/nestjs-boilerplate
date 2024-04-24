export class AccountProvider {
  static async findAccount(_: any, id: any) {
    return {
      accountId: id,
      async claims() {
        return {
          sub: id,
        };
      },
    };
  }
  static async loadExistingGrant(ctx) {
    const grant = new ctx.oidc.provider.Grant({
      clientId: ctx.oidc.client.clientId,
      accountId: ctx.oidc.session.accountId,
    });
    grant.addOIDCScope('openid profile offline_access');
    await grant.save();
    return grant;
  }
}
