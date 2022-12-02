"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const defaultQueryMetadata = {
    name: '',
    required: true
};
exports.ApiImplicitQuery = (metadata) => {
    const param = {
        name: lodash_1.isNil(metadata.name) ? defaultQueryMetadata.name : metadata.name,
        in: 'query',
        description: metadata.description,
        required: metadata.required,
        type: metadata.type,
        enum: undefined
    };
    if (metadata.isArray) {
        param.type = Array;
        if (metadata.enum) {
            param.items = {
                type: 'string',
                enum: metadata.enum
            };
        }
        else {
            param.items = {
                type: metadata.type
            };
        }
    }
    else if (metadata.enum) {
        param.type = String;
        param.enum = metadata.enum;
    }
    return helpers_1.createParamDecorator(param, defaultQueryMetadata);
};
