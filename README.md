# Slingui Services

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=atlas-cli_nestjs-boilerplate)](https://sonarcloud.io/summary/new_code?id=atlas-cli_nestjs-boilerplate)
[![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

## Description

NestJS in Serverless Application with mongo CDK for startup projects.

## Packages

1. NestJS
2. Typescript
3. CDK
4. JEST

## Table of Contents

- [Installing and Running](docs/installing-and-running.md)
- [Working with database](docs/database.md)
- [Auth](docs/auth.md)

## Quick run

```bash
git clone --depth 1 https://github.com/slingui-dev/server-side.git my-app
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
git clone --depth 1 https://github.com/slingui-dev/server-side.git my-app
cd my-app/
cp env-example .env
```

Change `DATABASE_HOST=mongo` to `DATABASE_HOST=localhost`

Run additional container:

```bash
docker compose up -d mongo
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