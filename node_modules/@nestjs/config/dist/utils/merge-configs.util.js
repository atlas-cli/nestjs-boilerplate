"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeConfigObject = void 0;
const lodash_1 = require("lodash");
function mergeConfigObject(host, partial, token) {
    if (token) {
        (0, lodash_1.set)(host, token, partial);
        return partial;
    }
    Object.assign(host, partial);
}
exports.mergeConfigObject = mergeConfigObject;
