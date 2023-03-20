# Work with database

In NestJS Boilerplate uses [Mongoose](https://www.npmjs.com/package/mongoose) and [MongoDB] for working with database, and all examples will for [Mongoose](https://docs.nestjs.com/techniques/mongodb).

---

## Table of Contents

- [Working with database schema](#working-with-database-schema)
- [Seeding](#seeding)
  - [Creating seeds](#creating-seeds)
  - [Run seed](#run-seed)
- [Performance optimization](#performance-optimization)
  - [Indexes and Foreign Keys](#indexes-and-foreign-keys)
  - [Max connections](#max-connections)

---

## Working with database schema

Migrations is not necessary because mongo is not a relational database.

## Seeding

### Creating seeds

## TODO

### Run seed

```bash
npm run seed:run
```

---

## Performance optimization

### Indexes and Foreign Keys

Don't forget to create `indexes` in your monooose schemas.

Next: [Auth](auth.md)

GitHub: https://github.com/slingui-dev/server-side