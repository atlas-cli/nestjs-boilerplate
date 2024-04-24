import { ConfigService } from '@nestjs/config';
import { DynamoDBAdapter } from './../../auth/oidc/adapters/dynamodb.adapter';
import { jwks } from './../../common/config/certs/jwks';
import { ClientsService } from '../../auth/oidc/clients/clients.service';
import { accessTokenProvider } from '../../auth/oidc/providers/access-token.provider';
import { AccountProvider } from '../../auth/oidc/providers/account.provider';
import { logoutSource } from '../../auth/oidc/sources/logout.source';
import { AuthService } from './../../auth/auth.service';

export const oidcProviderFactory = async (
  configService: ConfigService,
  ClientsService: ClientsService,
  authService: AuthService,
) => {
  const configuration = {
    adapter: DynamoDBAdapter,
    clients: await ClientsService.getClients(),
    clientBasedCORS: () => true,
    findAccount: AccountProvider.findAccount,
    loadExistingGrant: AccountProvider.loadExistingGrant,
    jwks: jwks,
    tll: {
      AccessToken: 14400,
      AuthorizationCode: 1200 * 4,
      ClientCredentials: 7200,
      DeviceCode: 7200,
      IdToken: 14400,
      RefreshToken: 2592000,
    },

    features: {
      devInteractions: { enabled: true },
      rpInitiatedLogout: {
        logoutSource,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        postLogoutSuccessSource: () => {},
      },
    },
  };
  // run in memory for localhost
  if (configService.get('auth.sessionsTable') === undefined) {
    configuration.adapter = undefined;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Provider = require('fix-esm').require('oidc-provider').default;

  const provider = new Provider(
    configService.get('app.backendDomain'),
    configuration,
  );
  provider.proxy = true;

  return accessTokenProvider(provider, authService);
};
