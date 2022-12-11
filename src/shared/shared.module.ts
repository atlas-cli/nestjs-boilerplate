import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { DataSource } from 'typeorm';
import appConfig from './../common/config/app.config';
import authConfig from './../common/config/auth.config';
import databaseConfig from './../common/config/database.config';
import { TypeOrmConfigService } from './../common/database/typeorm-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                appConfig,
                databaseConfig,
                authConfig,
            ],
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                return dataSource;
            },
        }),
        I18nModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                fallbackLanguage: configService.get('app.fallbackLanguage'),
                loaderOptions: { path: join(__dirname, '../i18n/'), watch: false },
            }),
            resolvers: [
                {
                    use: HeaderResolver,
                    useFactory: (configService: ConfigService) => {
                        return [configService.get('app.headerLanguage')];
                    },
                    inject: [ConfigService],
                },
            ],
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    controllers: [],
})
export class SharedModule { }
