# Configuration Files Documentation
In this folder, we have 2 different configuration files for the database connection:

'typeorm-config.service.ts'
This configuration is used by the application. It sets up the TypeORM connection options utilizing the TypeOrmConfigService class which sources its settings from environment variables managed by the ConfigService. This ensures that the application connects to the correct database with the proper credentials and settings in a secure and configurable manner.

'cli.data-source.ts'
This configuration is used by the command line data source and inside of Lambda. It is designed to facilitate database operations through command line tools and to support the execution of database-related tasks within AWS Lambda functions. This configuration ensures that migrations, seeders, and other database utilities can be executed properly in both local and cloud environments.