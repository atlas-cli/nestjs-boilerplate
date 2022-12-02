import { INestApplication } from '@nestjs/common';
import { ApplicationConfig } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InstanceToken, Module } from '@nestjs/core/injector/module';
import { OpenAPIObject, SwaggerDocumentOptions } from './interfaces';
import { ModuleRoute } from './interfaces/module-route.interface';
import { SchemaObject } from './interfaces/open-api-spec.interface';
export declare class SwaggerScanner {
    private readonly transformer;
    private readonly schemaObjectFactory;
    private readonly explorer;
    scanApplication(app: INestApplication, options: SwaggerDocumentOptions): Omit<OpenAPIObject, 'openapi' | 'info'>;
    scanModuleRoutes(routes: Map<InstanceToken, InstanceWrapper>, modulePath: string | undefined, globalPrefix: string | undefined, applicationConfig: ApplicationConfig, operationIdFactory?: (controllerKey: string, methodKey: string) => string): ModuleRoute[];
    getModules(modulesContainer: Map<string, Module>, include: Function[]): Module[];
    addExtraModels(schemas: Record<string, SchemaObject>, extraModels: Function[]): void;
    private getModulePathMetadata;
}
