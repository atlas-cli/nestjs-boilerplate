"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportStrategy = void 0;
const passport = require("passport");
function PassportStrategy(Strategy, name) {
    class MixinStrategy extends Strategy {
        constructor(...args) {
            const callback = (...params) => __awaiter(this, void 0, void 0, function* () {
                const done = params[params.length - 1];
                try {
                    const validateResult = yield this.validate(...params);
                    if (Array.isArray(validateResult)) {
                        done(null, ...validateResult);
                    }
                    else {
                        done(null, validateResult);
                    }
                }
                catch (err) {
                    done(err, null);
                }
            });
            super(...args, callback);
            const passportInstance = this.getPassportInstance();
            if (name) {
                passportInstance.use(name, this);
            }
            else {
                passportInstance.use(this);
            }
        }
        getPassportInstance() {
            return passport;
        }
    }
    return MixinStrategy;
}
exports.PassportStrategy = PassportStrategy;
