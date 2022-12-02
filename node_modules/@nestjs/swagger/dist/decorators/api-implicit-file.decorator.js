"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const helpers_1 = require("./helpers");
const defaultFileMetadata = {
    name: '',
    required: true
};
exports.ApiImplicitFile = (metadata) => {
    const param = {
        name: lodash_1.isNil(metadata.name) ? defaultFileMetadata.name : metadata.name,
        in: 'formData',
        description: metadata.description || '',
        required: metadata.required || false,
        type: 'file'
    };
    return helpers_1.createParamDecorator(param, defaultFileMetadata);
};
