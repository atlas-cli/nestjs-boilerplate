"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapChildrenToValidationErrors = void 0;
const mapChildrenToValidationErrors = (error, parentPath) => {
    if (!(error.children && error.children.length)) {
        return [error];
    }
    const validationErrors = [];
    parentPath = parentPath ? `${parentPath}.${error.property}` : error.property;
    for (const item of error.children) {
        if (item.children && item.children.length) {
            validationErrors.push(...(0, exports.mapChildrenToValidationErrors)(item, parentPath));
        }
        validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
    }
    return validationErrors;
};
exports.mapChildrenToValidationErrors = mapChildrenToValidationErrors;
const prependConstraintsWithParentProp = (parentPath, error) => {
    const constraints = {};
    for (const key in error.constraints) {
        constraints[key] = `${parentPath}.${error.constraints[key]}`;
    }
    return Object.assign(Object.assign({}, error), { constraints });
};
//# sourceMappingURL=format.js.map