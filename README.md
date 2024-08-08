# Modular Monolith with AWS Lambda and CDK

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=atlas-cli_nestjs-boilerplate)](https://sonarcloud.io/summary/new_code?id=atlas-cli_nestjs-boilerplate)
[![CircleCI](https://circleci.com/gh/circleci/circleci-docs.svg?style=svg)](https://circleci.com/gh/circleci/circleci-docs)

## Description

This project provides a robust backend solution by leveraging a modular monolith architecture with AWS Lambda, NestJS, and PostgreSQL, all orchestrated using AWS CDK (Cloud Development Kit). Utilizing a combination of AWS Lambda, Relational Database Service (RDS), RDS Data API, and CDK, this setup ensures continuous deployment and management of your backend architecture through Infrastructure as Code (IAC) principles. Explore the benefits of a lambdalith approach to achieve scalability and flexibility while maintaining efficient development workflows with CDK's programmable infrastructure.

## Table of Contents

- [Installing and Running](docs/installing-and-running.md)
- [Working with Database](docs/database.md)
- [Deploy on AWS](docs/deploy.md)
- [Auth](docs/auth.md)

## Quick Run

`bash`
git clone --depth 1 https://github.com/atlas-cli/nestjs-boilerplate.git my-app
cd my-app/
cp .env.example .env
docker compose up -d

To check status, run:

`bash`
docker compose logs

## Comfortable Development

`bash`
git clone --depth 1 https://github.com/atlas-cli/nestjs-boilerplate.git my-app
cd my-app/
cp env.example .env

Run all using Docker Compose:

`bash`
docker compose up

For local use: localhost in host
Inside a Docker container: postgres host

`bash`
npm install

npm run migration:run

npm run seed:run

npm run start:dev

## Links

- Swagger: http://localhost:3000/swagger/docs

## Database Utils

Generate migration:

`bash`
npm run migration:generate -- src/database/migrations/CreateNameTable

Run migration:

`bash`
npm run migration:run

Revert migration:

`bash`
npm run migration:revert

Drop all tables in the database:

`bash`
npm run schema:drop

Run seed:

`bash`
npm run seed:run

## Tests

`bash`
# Unit tests
npm run test

# E2E tests
npm run test:e2e