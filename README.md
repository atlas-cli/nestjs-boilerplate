# NestJS in Serverless Application with CDK

## Description

NestJS in Serverless Application with postgres(typeorm) CDK for startup projects.

## Table of Contents

- [Installing and Running](docs/installing-and-running.md)
- [Working with database](docs/database.md)
- [Auth](docs/auth.md)

## Features

- :file_folder: Database: This feature uses TypeORM, an ORM (Object-Relational Mapping) library that simplifies the process of working with databases in your application.

- :seedling: Seeding: This feature allows you to seed your database with initial data, which can be useful for testing and development purposes.

- :wrench: Config Service: This feature uses @nestjs/config, a module that helps you manage configuration in your NestJS application.

- :e-mail: Sign in and sign up via email: This feature allows users to sign in and sign up to your application using their email address.

- :key: Use Admin and User roles: This feature allows you to define different roles for users of your application, such as Admin and User, and control access to certain features based on these roles.

- :earth_americas: Internacionalization with I18N: This feature uses nestjs-i18n to support internationalization (I18N) in your application, allowing you to translate your application into different languages.

- :paperclip: File uploads: This feature allows users to upload files to your application. It supports both local and Amazon S3 drivers for storing the uploaded files.

- :bar_chart: Swagger: This feature uses Swagger, a tool for generating API documentation, to document your application's API.

- :pill: E2E Tests: This feature includes end-to-end (E2E) tests, which test the full stack of your application to ensure it is working as expected.

- :whale: Docker and Docker Composer Files: This feature includes Docker and Docker Compose files, which allow you to containerize your application and run it in a Docker environment.

- :stopwatch: CircleCI: This feature uses CircleCI, a continuous integration and delivery platform, to set up pipelines that build, test, lint, run integration tests, diff, and deploy your code. The pipelines can also be put on hold if needed.

- :construction: Infraestructure as a code with CDK: This feature allows you to define your infrastructure as code using the AWS Cloud Development Kit (CDK), which makes it easier to automate the process of creating and managing your infrastructure.

- :computer: Typescript config in tsconfing.infra.json for CDK: This feature includes a Typescript config file (tsconfing.infra.json) that is used to configure the CDK for your application.

- :earth_americas: Default environments development and production: This feature includes default environments for development and production, which can be used to separate your code and infrastructure for different stages of the development process.

- :file_folder: TypeORM lambda environment: This feature allows you to use TypeORM in a lambda environment, allowing you to run your database operations in a serverless environment.

- :file_folder: Postgres environment: This feature allows you to set up a Postgres database environment, which can be used to store and manage data.

- :key: AWS IAM authentication for database and environment setup: This feature allows you to use AWS IAM (Identity and Access Management) to authenticate and authorize access to the database and environment.

- :loop: Multiples lambda services in the same repository: This feature allows you to store multiple lambda services, or small, independent units of code that are triggered by certain events, in the same repository. This can be useful for organizing your code and making it easier to maintain.

- :file_folder: Common folder for share code between different services: This feature allows you to create a common folder that can be used to share code between different services. This can be useful for reducing duplication and improving code reuse.

- :construction: Multiples infrastructure as a code layers: This feature allows you to define your infrastructure as code, meaning that you can use code to automate the process of creating and managing your infrastructure. The core layer is for database and storage, while the application layer is for lambda and clients.

- :package: ESBuild for compilate small lambda zip: This feature uses ESBuild, a super-fast JavaScript bundler and minifier, to compile small lambda zip files. This can help improve the performance and efficiency of your lambdas.

- :computer: Aurora Serverless V2 and security group: This feature allows you to use Aurora Serverless V2, a fully managed, autoscaling MySQL-compatible database, and a security group, which is a virtual firewall that controls inbound and outbound traffic to your database.

- :pill: Create lambda connection pool with RDS proxy: This feature allows you to create a connection pool, a group of reusable connections that can be used to connect to a database, and use an RDS (Relational Database Service) proxy to manage connections to the database. This can help improve the performance and reliability of your database.

- :rocket: Create lambda for run migrations in staging: This feature allows you to create a lambda function that can be used to run migrations, or changes to the database schema, in the staging environment. This can be useful for testing and debugging your database.

- :gateway: API Gateway: This feature allows you to use API Gateway, a fully managed service that makes it easy to create, publish, maintain, monitor, and secure APIs, to connect your backend services to your applications.

- :twisted_rightwards_arrows: Lambda API Gateway proxy to NestJS: This feature allows you to use a lambda function as an API Gateway proxy to connect to NestJS, a modular, fast, and powerful server-side application framework built with TypeScript.

- :notebook: Base repository documentation: This feature provides documentation for the base repository, which can be used as a reference for understanding and using the code in the repository.

- :key: OIDC Service for secure tokens: This feature allows you to use an OIDC (OpenID Connect) service to generate secure tokens, which can be used to authenticate and authorize access to your application.

- :paperclip: You can use Compodoc or TSDoc to generate technical documentation for your methods, or you can manually write documentation in the docs/ folder and update the docs/summary.json file. Compodoc and TSDoc are tools that allow you to easily generate documentation for your codebase.

- :rocket: A contribution template guide has been created for sharing with your team or for contributing to this project.

- :security: Set up SonarCloud project settings to improve your code security

## Quick run

```bash
git clone --depth 1 https://github.com/atlas-cli/nestjs-boilerplate.git my-app
cd my-app/
cp env-example .env
docker compose up -d
```

For check status run

```bash
docker compose logs
```

## Comfortable development

```bash
git clone --depth 1 https://github.com/atlas-cli/nestjs-boilerplate.git my-app
cd my-app/
cp env-example .env
```

Change `DATABASE_HOST=postgres` to `DATABASE_HOST=localhost`

Run additional container:

```bash
docker compose up -d postgres redis
```

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Links

- Swagger: http://localhost:3000/docs

## Database utils

Generate migration

```bash
npm run migration:generate -- src/database/migrations/CreateNameTable 
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Test benchmarking stress

```bash
docker run --rm jordi/ab -n 100 -c 100 -T application/json -H "Authorization: Bearer USER_TOKEN" -v 2 http://<server_ip>:3000/api/v1/users
```
## Inspirations:

https://github.com/brocoders/nestjs-boilerplate
https://github.com/NeoSOFT-Technologies/rest-node-nestjs