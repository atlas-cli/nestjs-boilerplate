import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';
import { Reflector } from '@nestjs/core';

/**
 * Core bootstrap module should be loaded here.
 * @param app
 *
 */

export default async function commonBootstrap(app: INestApplication, module: any,) {
    useContainer(app.select(module), { fallbackOnErrors: true });

    app.useGlobalPipes(new ValidationPipe(validationOptions));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}