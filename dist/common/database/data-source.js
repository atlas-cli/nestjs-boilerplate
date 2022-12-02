"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DATABASE_TYPE,
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    dropSchema: false,
    keepConnectionAlive: true,
    logging: process.env.NODE_ENV !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
    },
    extra: {
        max: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) || 100,
        ssl: process.env.DATABASE_SSL_ENABLED === 'true'
            ? {
                rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
                ca: (_a = process.env.DATABASE_CA) !== null && _a !== void 0 ? _a : undefined,
                key: (_b = process.env.DATABASE_KEY) !== null && _b !== void 0 ? _b : undefined,
                cert: (_c = process.env.DATABASE_CERT) !== null && _c !== void 0 ? _c : undefined,
            }
            : undefined,
    },
});
//# sourceMappingURL=data-source.js.map