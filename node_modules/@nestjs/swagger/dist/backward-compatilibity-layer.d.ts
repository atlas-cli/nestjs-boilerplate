import { SwaggerCustomOptions, LegacySwaggerCustomOptions } from './interfaces';
import { HttpServer } from '@nestjs/common/interfaces/http/http-server.interface';
export interface FastifyExtra {
    initOAuth?: Record<string, any>;
    staticCSP?: boolean | string | Record<string, string | string[]>;
    transformStaticCSP?: (header: string) => string;
    uiHooks?: {
        onRequest?: Function;
        preHandler?: Function;
    };
}
export interface ProcessSwaggerOptionsOutput {
    customOptions: SwaggerCustomOptions;
    extra: FastifyExtra;
}
export declare function processSwaggerOptions(options?: LegacySwaggerCustomOptions): ProcessSwaggerOptionsOutput;
export declare function serveDocumentsFastify(finalPath: string, httpAdapter: HttpServer, swaggerInitJS: string, yamlDocument: string, jsonDocument: string, html: string, fastifyExtras: FastifyExtra): void;
