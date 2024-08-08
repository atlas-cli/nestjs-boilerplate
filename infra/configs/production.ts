import { ApplicationProps } from '.././props/application-props';
import { stacks } from '../stacks';
import { config } from 'dotenv';

const environment = config({ path: '.env.production' });

export const production: ApplicationProps = {
  applicationName: environment.parsed.INFRA_APPLICATION_NAME ?? 'Atlas',
  stageName: environment.parsed.INFRA_STAGE_NAME ?? 'production',
  env: {
    account: environment.parsed.INFRA_AWS_ACCOUNT,
    region: environment.parsed.INFRA_AWS_REGION,
  },
  githubOrganizationId: environment.parsed.ORGANIZATION_GITHUB_ORGANIZATION_ID,
  layersStack: stacks,
  applications: {
    core: {
      domainName: 'boilerplate.atlascli.io',
      apiDomainName: 'api.boilerplate.atlascli.io',
      idPublicHostZone: 'Z03396972KP6M49QCZJPD',
      applicationEnvironment: {
        NODE_ENV: environment.parsed.NODE_ENV || 'development',
        APP_PORT: environment.parsed.APP_PORT || '3000',
        APP_NAME: environment.parsed.APP_NAME || 'NestJS Boilerplate',
        API_PREFIX: environment.parsed.API_PREFIX || 'api',
        APP_FALLBACK_LANGUAGE: environment.parsed.APP_FALLBACK_LANGUAGE || 'en',
        APP_HEADER_LANGUAGE:
          environment.parsed.APP_HEADER_LANGUAGE || 'x-custom-lang',
        BACKEND_DOMAIN:
          environment.parsed.BACKEND_DOMAIN || 'http://localhost:3000',
        FRONTEND_DOMAIN:
          environment.parsed.BACKEND_DOMAIN || 'http://localhost:4200',
        SWAGGER_ENABLED: environment.parsed.SWAGGER_ENABLED || 'true',
        I18N_DIRECTORY: environment.parsed.I18N_DIRECTORY || 'src/i18n',
        AUTH_JWT_SECRET: environment.parsed.AUTH_JWT_SECRET || 'secret',
        AUTH_JWT_TOKEN_EXPIRES_IN:
          environment.parsed.AUTH_JWT_TOKEN_EXPIRES_IN || '1d',
      },
    },
  },
};
