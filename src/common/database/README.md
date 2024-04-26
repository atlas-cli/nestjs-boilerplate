# Configuration Files Documentation

In this folder, we have 3 different configuration files for the database connection:

1. `typeorm-config.service.ts` - This configuration is used by a server both locally and in the lambdas for HTTP requests.
2. `lambda-cli.data-source` - This configuration is used to run the TypeORM CLI within the production environment with the lambdas.
3. `local-cli.data-source.ts` - it is used to run migrations and seeds locally.