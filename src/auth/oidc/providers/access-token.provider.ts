import { AuthService } from './../../../auth/auth.service';

export function accessTokenProvider(provider, authService: AuthService) {
  async function save() {
    const accessToken = await authService.buildAccessToken(this.accountId);
    provider.emit('token.issued', this);
    return accessToken;
  }
  function bind(token) {
    provider[token].prototype.save = save;
  }

  bind('AccessToken');
  return provider;
}
