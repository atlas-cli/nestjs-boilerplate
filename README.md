# NestJS and PostgreSQL on AWS using CDK

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=atlas-cli_nestjs-boilerplate)](https://sonarcloud.io/summary/new_code?id=atlas-cli_nestjs-boilerplate)
[![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

## Description

Provide a robust backend solution leveraging NestJS with PostgreSQL on AWS infrastructure orchestrated with CDK (Cloud Development Kit). Employing a combination of AWS Lambda, Relational Database Service (RDS), RDS Proxy, CloudFormation, and CDK, this project ensures continuous deployment and management of your backend architecture using Infrastructure as Code (IAC) principles. Leverage the scalability, reliability, and flexibility of AWS services while maintaining efficient development workflows with CDK's programmable infrastructure approach.

## Table of Contents

- [Installing and Running](docs/installing-and-running.md)
- [Working with database](docs/database.md)
- [Deploy on AWS](docs/deploy.md)
- [Auth](docs/auth.md)

## Quick run

```bash
git clone --depth 1 https://github.com/atlas-cli/nestjs-boilerplate.git my-app
cd my-app/
cp .env.example .env
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
cp env.example .env
```

Run all using in docker compose:

```bash
docker compose up
```

Local use: localhost in host
Inside a docker use: postgres host

```bash
npm install

npm run migration:run

npm run seed:run

npm run start:dev
```

## Links

- Swagger: http://localhost:3000/swagger/docs

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

## Inspirations:

https://github.com/brocoders/nestjs-boilerplate
https://github.com/NeoSOFT-Technologies/rest-node-nestjs