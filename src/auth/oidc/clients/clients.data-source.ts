import { ConfigService } from '@nestjs/config';
import { ClientMetadata } from 'oidc-provider';

export const buildClientsDataSource = (
  configService: ConfigService,
): ClientMetadata[] => {
  const secret = configService.get('auth.secret');
  return [
    {
      application_type: 'web',
      client_id: '24d31573-cf69-4164-b36d-d1a8666eabe4',
      client_secret: secret,
      redirect_uris: [
        'http://localhost:5173',
        'https://consultor.dev.domain.comn',
        'https://cliente.dev.domain.comn',
        'https://consultor.hml.domain.comn',
        'https://cliente.hml.domain.comn',
      ],
      response_types: ['code'],
      grant_types: ['refresh_token', 'authorization_code'],
      post_logout_redirect_uris: [
        'http://localhost:5173',
        'https://consultor.dev.domain.comn',
        'https://cliente.dev.domain.comn',
        'https://consultor.hml.domain.comn',
        'https://cliente.hml.domain.comn',
      ],
      token_endpoint_auth_method: 'none',
    },
  ];
};
