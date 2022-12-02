"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.before = void 0;
const merge_options_1 = require("./merge-options");
const controller_class_visitor_1 = require("./visitors/controller-class.visitor");
const model_class_visitor_1 = require("./visitors/model-class.visitor");
const modelClassVisitor = new model_class_visitor_1.ModelClassVisitor();
const controllerClassVisitor = new controller_class_visitor_1.ControllerClassVisitor();
const isFilenameMatched = (patterns, filename) => patterns.some((path) => filename.includes(path));
const before = (options, program) => {
    options = (0, merge_options_1.mergePluginOptions)(options);
    return (ctx) => {
        return (sf) => {
            if (isFilenameMatched(options.dtoFileNameSuffix, sf.fileName)) {
                return modelClassVisitor.visit(sf, ctx, program, options);
            }
            if (isFilenameMatched(options.controllerFileNameSuffix, sf.fileName)) {
                return controllerClassVisitor.visit(sf, ctx, program, options);
            }
            return sf;
        };
    };
};
exports.before = before;
