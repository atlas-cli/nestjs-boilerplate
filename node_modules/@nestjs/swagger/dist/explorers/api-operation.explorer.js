"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exploreApiOperationMetadata = void 0;
const constants_1 = require("../constants");
const exploreApiOperationMetadata = (instance, prototype, method) => Reflect.getMetadata(constants_1.DECORATORS.API_OPERATION, method);
exports.exploreApiOperationMetadata = exploreApiOperationMetadata;
