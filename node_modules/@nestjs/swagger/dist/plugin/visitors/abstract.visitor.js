"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFileVisitor = void 0;
const ts = require("typescript");
const plugin_constants_1 = require("../plugin-constants");
const [major, minor] = (_a = ts.versionMajorMinor) === null || _a === void 0 ? void 0 : _a.split('.').map((x) => +x);
class AbstractFileVisitor {
    updateImports(sourceFile, factory, program) {
        if (!factory) {
            const importEqualsDeclaration = major == 4 && minor >= 2
                ? ts.createImportEqualsDeclaration(undefined, undefined, false, plugin_constants_1.OPENAPI_NAMESPACE, ts.createExternalModuleReference(ts.createLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME)))
                : ts.createImportEqualsDeclaration(undefined, undefined, plugin_constants_1.OPENAPI_NAMESPACE, ts.createExternalModuleReference(ts.createLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME)));
            return ts.updateSourceFileNode(sourceFile, [
                importEqualsDeclaration,
                ...sourceFile.statements
            ]);
        }
        const importEqualsDeclaration = major >= 4 && minor >= 2
            ? minor >= 8
                ? factory.createImportEqualsDeclaration(undefined, false, factory.createIdentifier(plugin_constants_1.OPENAPI_NAMESPACE), factory.createExternalModuleReference(factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME)))
                : factory.createImportEqualsDeclaration(undefined, undefined, false, plugin_constants_1.OPENAPI_NAMESPACE, factory.createExternalModuleReference(factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME)))
            : factory.createImportEqualsDeclaration(undefined, undefined, plugin_constants_1.OPENAPI_NAMESPACE, factory.createExternalModuleReference(factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME)));
        const compilerOptions = program.getCompilerOptions();
        if (compilerOptions.module >= ts.ModuleKind.ES2015 &&
            compilerOptions.module <= ts.ModuleKind.ESNext) {
            const importAsDeclaration = (minor >= 8 && major >= 4) || major >= 5
                ? factory.createImportDeclaration(undefined, factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier(plugin_constants_1.OPENAPI_NAMESPACE))), factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME), undefined)
                : factory.createImportDeclaration(undefined, undefined, factory.createImportClause(false, undefined, factory.createNamespaceImport(factory.createIdentifier(plugin_constants_1.OPENAPI_NAMESPACE))), factory.createStringLiteral(plugin_constants_1.OPENAPI_PACKAGE_NAME), undefined);
            return factory.updateSourceFile(sourceFile, [
                importAsDeclaration,
                ...sourceFile.statements
            ]);
        }
        else {
            return factory.updateSourceFile(sourceFile, [
                importEqualsDeclaration,
                ...sourceFile.statements
            ]);
        }
    }
}
exports.AbstractFileVisitor = AbstractFileVisitor;
