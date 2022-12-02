"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nYamlLoader = void 0;
const i18n_abstract_loader_1 = require("./i18n.abstract.loader");
const yaml = require("js-yaml");
class I18nYamlLoader extends i18n_abstract_loader_1.I18nAbstractLoader {
    formatData(data) {
        return yaml.load(data, { json: true });
    }
    getDefaultOptions() {
        return {
            filePattern: '*.yml',
            watch: false,
        };
    }
}
exports.I18nYamlLoader = I18nYamlLoader;
//# sourceMappingURL=i18n.yaml.loader.js.map