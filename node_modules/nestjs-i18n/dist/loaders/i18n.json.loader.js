"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nJsonLoader = void 0;
const i18n_abstract_loader_1 = require("./i18n.abstract.loader");
class I18nJsonLoader extends i18n_abstract_loader_1.I18nAbstractLoader {
    getDefaultOptions() {
        return {
            filePattern: '*.json',
            watch: false,
        };
    }
    formatData(data) {
        return JSON.parse(data);
    }
}
exports.I18nJsonLoader = I18nJsonLoader;
//# sourceMappingURL=i18n.json.loader.js.map