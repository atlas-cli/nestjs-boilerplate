"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infinityPagination = void 0;
const infinityPagination = (data, options) => {
    return {
        data,
        hasNextPage: data.length === options.limit,
    };
};
exports.infinityPagination = infinityPagination;
//# sourceMappingURL=infinity-pagination.js.map