"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nLanguages = void 0;
const common_1 = require("@nestjs/common");
const i18n_constants_1 = require("../i18n.constants");
const I18nLanguages = () => {
    return (0, common_1.Inject)(i18n_constants_1.I18N_LANGUAGES);
};
exports.I18nLanguages = I18nLanguages;
//# sourceMappingURL=i18n-languages.decorator.js.map