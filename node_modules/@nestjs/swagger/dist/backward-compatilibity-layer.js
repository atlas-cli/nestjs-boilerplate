"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveDocumentsFastify = exports.processSwaggerOptions = void 0;
function processSwaggerOptions(options = {}) {
    const unifiedOptions = options;
    const fastifyOptions = options;
    const customOptions = {
        useGlobalPrefix: unifiedOptions.useGlobalPrefix,
        explorer: unifiedOptions.explorer,
        customCss: unifiedOptions.customCss,
        customCssUrl: unifiedOptions.customCssUrl,
        customJs: unifiedOptions.customJs,
        customfavIcon: unifiedOptions.customfavIcon,
        swaggerUrl: unifiedOptions.swaggerUrl,
        customSiteTitle: unifiedOptions.customSiteTitle,
        validatorUrl: unifiedOptions.validatorUrl,
        url: unifiedOptions.url,
        urls: unifiedOptions.urls,
        initOAuth: unifiedOptions.initOAuth,
        swaggerOptions: unifiedOptions.swaggerOptions || fastifyOptions.uiConfig
    };
    const extra = {
        uiHooks: fastifyOptions.uiHooks
    };
    return { customOptions, extra };
}
exports.processSwaggerOptions = processSwaggerOptions;
function serveDocumentsFastify(finalPath, httpAdapter, swaggerInitJS, yamlDocument, jsonDocument, html, fastifyExtras) {
    const httpServer = httpAdapter;
    const hasParserGetterDefined = Object.getPrototypeOf(httpServer).hasOwnProperty('isParserRegistered');
    if (hasParserGetterDefined && !httpServer.isParserRegistered) {
        httpServer.registerParserMiddleware();
    }
    httpServer.register((fastifyApp) => __awaiter(this, void 0, void 0, function* () {
        const hooks = Object.create(null);
        if (fastifyExtras.uiHooks) {
            const additionalHooks = ['onRequest', 'preHandler'];
            for (const hook of additionalHooks) {
                hooks[hook] = fastifyExtras.uiHooks[hook];
            }
        }
        fastifyApp.route(Object.assign(Object.assign({ url: finalPath, method: 'GET', schema: { hide: true } }, hooks), { handler: (req, reply) => {
                reply.type('text/html');
                reply.send(html);
            } }));
        fastifyApp.route(Object.assign(Object.assign({ url: `${finalPath}/swagger-ui-init.js`, method: 'GET', schema: { hide: true } }, hooks), { handler: (req, reply) => {
                reply.type('application/javascript');
                reply.send(swaggerInitJS);
            } }));
        fastifyApp.route(Object.assign(Object.assign({ url: `${finalPath}-json`, method: 'GET', schema: { hide: true } }, hooks), { handler: (req, reply) => {
                reply.type('text/json');
                reply.send(jsonDocument);
            } }));
        fastifyApp.route(Object.assign(Object.assign({ url: `${finalPath}-yaml`, method: 'GET', schema: { hide: true } }, hooks), { handler: (req, reply) => {
                reply.type('text/yaml');
                reply.send(yamlDocument);
            } }));
    }));
}
exports.serveDocumentsFastify = serveDocumentsFastify;
