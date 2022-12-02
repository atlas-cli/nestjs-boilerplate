import { HttpServer, INestApplication, INestMicroservice, NestApplicationOptions, Type } from '@nestjs/common';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';
import { AbstractHttpAdapter, NestApplicationContext } from '@nestjs/core';
import { ApplicationConfig } from '@nestjs/core/application-config';
import { NestContainer } from '@nestjs/core/injector/container';
import { Module } from '@nestjs/core/injector/module';
export declare class TestingModule extends NestApplicationContext {
    private readonly applicationConfig;
    constructor(container: NestContainer, scope: Type<any>[], contextModule: Module, applicationConfig: ApplicationConfig);
    createNestApplication<T extends INestApplication = INestApplication>(httpAdapter?: HttpServer | AbstractHttpAdapter, options?: NestApplicationOptions): T;
    createNestMicroservice<T extends object>(options: NestMicroserviceOptions & T): INestMicroservice;
    private createHttpAdapter;
    private applyLogger;
    private createAdapterProxy;
}
