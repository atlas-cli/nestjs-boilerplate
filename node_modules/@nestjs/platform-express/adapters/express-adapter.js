"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressAdapter = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("@nestjs/common/interfaces");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const http_adapter_1 = require("@nestjs/core/adapters/http-adapter");
const router_method_factory_1 = require("@nestjs/core/helpers/router-method-factory");
const body_parser_1 = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const https = require("https");
class ExpressAdapter extends http_adapter_1.AbstractHttpAdapter {
    constructor(instance) {
        super(instance || express());
        this.routerMethodFactory = new router_method_factory_1.RouterMethodFactory();
    }
    reply(response, body, statusCode) {
        if (statusCode) {
            response.status(statusCode);
        }
        if ((0, shared_utils_1.isNil)(body)) {
            return response.send();
        }
        if (body instanceof common_1.StreamableFile) {
            const streamHeaders = body.getHeaders();
            if (response.getHeader('Content-Type') === undefined &&
                streamHeaders.type !== undefined) {
                response.setHeader('Content-Type', streamHeaders.type);
            }
            if (response.getHeader('Content-Disposition') === undefined &&
                streamHeaders.disposition !== undefined) {
                response.setHeader('Content-Disposition', streamHeaders.disposition);
            }
            if (response.getHeader('Content-Length') === undefined &&
                streamHeaders.length !== undefined) {
                response.setHeader('Content-Length', streamHeaders.length);
            }
            return body.getStream().pipe(response);
        }
        return (0, shared_utils_1.isObject)(body) ? response.json(body) : response.send(String(body));
    }
    status(response, statusCode) {
        return response.status(statusCode);
    }
    render(response, view, options) {
        return response.render(view, options);
    }
    redirect(response, statusCode, url) {
        return response.redirect(statusCode, url);
    }
    setErrorHandler(handler, prefix) {
        return this.use(handler);
    }
    setNotFoundHandler(handler, prefix) {
        return this.use(handler);
    }
    setHeader(response, name, value) {
        return response.set(name, value);
    }
    listen(port, ...args) {
        return this.httpServer.listen(port, ...args);
    }
    close() {
        if (!this.httpServer) {
            return undefined;
        }
        return new Promise(resolve => this.httpServer.close(resolve));
    }
    set(...args) {
        return this.instance.set(...args);
    }
    enable(...args) {
        return this.instance.enable(...args);
    }
    disable(...args) {
        return this.instance.disable(...args);
    }
    engine(...args) {
        return this.instance.engine(...args);
    }
    useStaticAssets(path, options) {
        if (options && options.prefix) {
            return this.use(options.prefix, express.static(path, options));
        }
        return this.use(express.static(path, options));
    }
    setBaseViewsDir(path) {
        return this.set('views', path);
    }
    setViewEngine(engine) {
        return this.set('view engine', engine);
    }
    getRequestHostname(request) {
        return request.hostname;
    }
    getRequestMethod(request) {
        return request.method;
    }
    getRequestUrl(request) {
        return request.originalUrl;
    }
    enableCors(options) {
        return this.use(cors(options));
    }
    createMiddlewareFactory(requestMethod) {
        return this.routerMethodFactory
            .get(this.instance, requestMethod)
            .bind(this.instance);
    }
    initHttpServer(options) {
        const isHttpsEnabled = options && options.httpsOptions;
        if (isHttpsEnabled) {
            this.httpServer = https.createServer(options.httpsOptions, this.getInstance());
            return;
        }
        this.httpServer = http.createServer(this.getInstance());
    }
    registerParserMiddleware(prefix, rawBody) {
        let bodyParserJsonOptions;
        if (rawBody === true) {
            bodyParserJsonOptions = {
                verify: (req, _res, buffer) => {
                    if (Buffer.isBuffer(buffer)) {
                        req.rawBody = buffer;
                    }
                    return true;
                },
            };
        }
        const parserMiddleware = {
            jsonParser: (0, body_parser_1.json)(bodyParserJsonOptions),
            urlencodedParser: (0, body_parser_1.urlencoded)({ extended: true }),
        };
        Object.keys(parserMiddleware)
            .filter(parser => !this.isMiddlewareApplied(parser))
            .forEach(parserKey => this.use(parserMiddleware[parserKey]));
    }
    setLocal(key, value) {
        this.instance.locals[key] = value;
        return this;
    }
    getType() {
        return 'express';
    }
    applyVersionFilter(handler, version, versioningOptions) {
        const callNextHandler = (req, res, next) => {
            if (!next) {
                throw new common_1.InternalServerErrorException('HTTP adapter does not support filtering on version');
            }
            return next();
        };
        if (version === interfaces_1.VERSION_NEUTRAL ||
            // URL Versioning is done via the path, so the filter continues forward
            versioningOptions.type === common_1.VersioningType.URI) {
            const handlerForNoVersioning = (req, res, next) => handler(req, res, next);
            return handlerForNoVersioning;
        }
        // Custom Extractor Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.CUSTOM) {
            const handlerForCustomVersioning = (req, res, next) => {
                const extractedVersion = versioningOptions.extractor(req);
                if (Array.isArray(version)) {
                    if (Array.isArray(extractedVersion) &&
                        version.filter(v => extractedVersion.includes(v)).length) {
                        return handler(req, res, next);
                    }
                    if ((0, shared_utils_1.isString)(extractedVersion) &&
                        version.includes(extractedVersion)) {
                        return handler(req, res, next);
                    }
                }
                else if ((0, shared_utils_1.isString)(version)) {
                    // Known bug here - if there are multiple versions supported across separate
                    // handlers/controllers, we can't select the highest matching handler.
                    // Since this code is evaluated per-handler, then we can't see if the highest
                    // specified version exists in a different handler.
                    if (Array.isArray(extractedVersion) &&
                        extractedVersion.includes(version)) {
                        return handler(req, res, next);
                    }
                    if ((0, shared_utils_1.isString)(extractedVersion) && version === extractedVersion) {
                        return handler(req, res, next);
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForCustomVersioning;
        }
        // Media Type (Accept Header) Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.MEDIA_TYPE) {
            const handlerForMediaTypeVersioning = (req, res, next) => {
                var _a, _b;
                const MEDIA_TYPE_HEADER = 'Accept';
                const acceptHeaderValue = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a[MEDIA_TYPE_HEADER]) ||
                    ((_b = req.headers) === null || _b === void 0 ? void 0 : _b[MEDIA_TYPE_HEADER.toLowerCase()]);
                const acceptHeaderVersionParameter = acceptHeaderValue
                    ? acceptHeaderValue.split(';')[1]
                    : undefined;
                // No version was supplied
                if ((0, shared_utils_1.isUndefined)(acceptHeaderVersionParameter)) {
                    if (Array.isArray(version)) {
                        if (version.includes(interfaces_1.VERSION_NEUTRAL)) {
                            return handler(req, res, next);
                        }
                    }
                }
                else {
                    const headerVersion = acceptHeaderVersionParameter.split(versioningOptions.key)[1];
                    if (Array.isArray(version)) {
                        if (version.includes(headerVersion)) {
                            return handler(req, res, next);
                        }
                    }
                    else if ((0, shared_utils_1.isString)(version)) {
                        if (version === headerVersion) {
                            return handler(req, res, next);
                        }
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForMediaTypeVersioning;
        }
        // Header Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.HEADER) {
            const handlerForHeaderVersioning = (req, res, next) => {
                var _a, _b;
                const customHeaderVersionParameter = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a[versioningOptions.header]) ||
                    ((_b = req.headers) === null || _b === void 0 ? void 0 : _b[versioningOptions.header.toLowerCase()]);
                // No version was supplied
                if ((0, shared_utils_1.isUndefined)(customHeaderVersionParameter)) {
                    if (Array.isArray(version)) {
                        if (version.includes(interfaces_1.VERSION_NEUTRAL)) {
                            return handler(req, res, next);
                        }
                    }
                }
                else {
                    if (Array.isArray(version)) {
                        if (version.includes(customHeaderVersionParameter)) {
                            return handler(req, res, next);
                        }
                    }
                    else if ((0, shared_utils_1.isString)(version)) {
                        if (version === customHeaderVersionParameter) {
                            return handler(req, res, next);
                        }
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForHeaderVersioning;
        }
    }
    isMiddlewareApplied(name) {
        const app = this.getInstance();
        return (!!app._router &&
            !!app._router.stack &&
            (0, shared_utils_1.isFunction)(app._router.stack.filter) &&
            app._router.stack.some((layer) => layer && layer.handle && layer.handle.name === name));
    }
}
exports.ExpressAdapter = ExpressAdapter;
