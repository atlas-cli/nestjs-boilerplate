"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nResolverOptions = exports.getI18nResolverOptionsToken = void 0;
const common_1 = require("@nestjs/common");
const __1 = require("..");
function getI18nResolverOptionsToken(target) {
    return `${target.name}${__1.I18N_RESOLVER_OPTIONS}`;
}
exports.getI18nResolverOptionsToken = getI18nResolverOptionsToken;
function I18nResolverOptions() {
    return (target, key, index) => {
        return (0, common_1.Inject)(getI18nResolverOptionsToken(target))(target, key, index);
    };
}
exports.I18nResolverOptions = I18nResolverOptions;
//# sourceMappingURL=i18n-resolver-options.decorator.js.map