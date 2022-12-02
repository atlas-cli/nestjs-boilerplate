"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiParam = void 0;
const lodash_1 = require("lodash");
const enum_utils_1 = require("../utils/enum.utils");
const helpers_1 = require("./helpers");
const defaultParamOptions = {
    name: '',
    required: true
};
function ApiParam(options) {
    const param = Object.assign({ name: (0, lodash_1.isNil)(options.name) ? defaultParamOptions.name : options.name, in: 'path' }, (0, lodash_1.omit)(options, 'enum'));
    const apiParamMetadata = options;
    if (apiParamMetadata.enum) {
        param.schema = param.schema || {};
        const paramSchema = param.schema;
        const enumValues = (0, enum_utils_1.getEnumValues)(apiParamMetadata.enum);
        paramSchema.type = (0, enum_utils_1.getEnumType)(enumValues);
        paramSchema.enum = enumValues;
        if (apiParamMetadata.enumName) {
            param.enumName = apiParamMetadata.enumName;
        }
    }
    return (0, helpers_1.createParamDecorator)(param, defaultParamOptions);
}
exports.ApiParam = ApiParam;
