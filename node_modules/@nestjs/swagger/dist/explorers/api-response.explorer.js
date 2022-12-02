"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreApiResponseMetadata = exports.exploreGlobalApiResponseMetadata = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@nestjs/common/constants");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const lodash_1 = require("lodash");
const constants_2 = require("../constants");
const response_object_factory_1 = require("../services/response-object-factory");
const merge_and_uniq_util_1 = require("../utils/merge-and-uniq.util");
const responseObjectFactory = new response_object_factory_1.ResponseObjectFactory();
const exploreGlobalApiResponseMetadata = (schemas, metatype) => {
    const responses = Reflect.getMetadata(constants_2.DECORATORS.API_RESPONSE, metatype);
    const produces = Reflect.getMetadata(constants_2.DECORATORS.API_PRODUCES, metatype);
    return responses
        ? {
            responses: mapResponsesToSwaggerResponses(responses, schemas, produces)
        }
        : undefined;
};
exports.exploreGlobalApiResponseMetadata = exploreGlobalApiResponseMetadata;
const exploreApiResponseMetadata = (schemas, instance, prototype, method) => {
    const responses = Reflect.getMetadata(constants_2.DECORATORS.API_RESPONSE, method);
    if (responses) {
        const classProduces = Reflect.getMetadata(constants_2.DECORATORS.API_PRODUCES, prototype);
        const methodProduces = Reflect.getMetadata(constants_2.DECORATORS.API_PRODUCES, method);
        const produces = (0, merge_and_uniq_util_1.mergeAndUniq)((0, lodash_1.get)(classProduces, 'produces'), methodProduces);
        return mapResponsesToSwaggerResponses(responses, schemas, produces);
    }
    const status = getStatusCode(method);
    if (status) {
        return { [status]: { description: '' } };
    }
    return undefined;
};
exports.exploreApiResponseMetadata = exploreApiResponseMetadata;
const getStatusCode = (method) => {
    const status = Reflect.getMetadata(constants_1.HTTP_CODE_METADATA, method);
    if (status) {
        return status;
    }
    const requestMethod = Reflect.getMetadata(constants_1.METHOD_METADATA, method);
    switch (requestMethod) {
        case common_1.RequestMethod.POST:
            return common_1.HttpStatus.CREATED;
        default:
            return common_1.HttpStatus.OK;
    }
};
const omitParamType = (param) => (0, lodash_1.omit)(param, 'type');
const mapResponsesToSwaggerResponses = (responses, schemas, produces = ['application/json']) => {
    produces = (0, shared_utils_1.isEmpty)(produces) ? ['application/json'] : produces;
    const openApiResponses = (0, lodash_1.mapValues)(responses, (response) => responseObjectFactory.create(response, produces, schemas));
    return (0, lodash_1.mapValues)(openApiResponses, omitParamType);
};
