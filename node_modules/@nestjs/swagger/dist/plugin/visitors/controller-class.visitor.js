"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerClassVisitor = void 0;
const lodash_1 = require("lodash");
const ts = require("typescript");
const decorators_1 = require("../../decorators");
const plugin_constants_1 = require("../plugin-constants");
const ast_utils_1 = require("../utils/ast-utils");
const plugin_utils_1 = require("../utils/plugin-utils");
const abstract_visitor_1 = require("./abstract.visitor");
const [tsVersionMajor, tsVersionMinor] = (_a = ts.versionMajorMinor) === null || _a === void 0 ? void 0 : _a.split('.').map((x) => +x);
const isInUpdatedAstContext = tsVersionMinor >= 8 || tsVersionMajor > 4;
class ControllerClassVisitor extends abstract_visitor_1.AbstractFileVisitor {
    visit(sourceFile, ctx, program, options) {
        const typeChecker = program.getTypeChecker();
        sourceFile = this.updateImports(sourceFile, ctx.factory, program);
        const visitNode = (node) => {
            if (ts.isMethodDeclaration(node)) {
                try {
                    return this.addDecoratorToNode(ctx.factory, node, typeChecker, options, sourceFile.fileName, sourceFile);
                }
                catch (_a) {
                    return node;
                }
            }
            return ts.visitEachChild(node, visitNode, ctx);
        };
        return ts.visitNode(sourceFile, visitNode);
    }
    addDecoratorToNode(factory, compilerNode, typeChecker, options, hostFilename, sourceFile) {
        var _a;
        const decorators = ts.canHaveDecorators
            ? ts.getDecorators(compilerNode)
            : compilerNode.decorators;
        if (!decorators) {
            return compilerNode;
        }
        const apiOperationDecoratorsArray = this.createApiOperationDecorator(factory, compilerNode, decorators, options, sourceFile, typeChecker);
        const removeExistingApiOperationDecorator = apiOperationDecoratorsArray.length > 0;
        const existingDecorators = removeExistingApiOperationDecorator
            ? decorators.filter((item) => (0, ast_utils_1.getDecoratorName)(item) !== decorators_1.ApiOperation.name)
            : decorators;
        const modifiers = (_a = (isInUpdatedAstContext
            ? ts.getModifiers(compilerNode)
            : compilerNode.modifiers)) !== null && _a !== void 0 ? _a : [];
        const updatedDecorators = [
            ...apiOperationDecoratorsArray,
            ...existingDecorators,
            factory.createDecorator(factory.createCallExpression(factory.createIdentifier(`${plugin_constants_1.OPENAPI_NAMESPACE}.${decorators_1.ApiResponse.name}`), undefined, [
                this.createDecoratorObjectLiteralExpr(factory, compilerNode, typeChecker, factory.createNodeArray(), hostFilename)
            ]))
        ];
        return isInUpdatedAstContext
            ? factory.updateMethodDeclaration(compilerNode, [...updatedDecorators, ...modifiers], compilerNode.asteriskToken, compilerNode.name, compilerNode.questionToken, compilerNode.typeParameters, compilerNode.parameters, compilerNode.type, compilerNode.body)
            : factory.updateMethodDeclaration(compilerNode, updatedDecorators, modifiers, compilerNode.asteriskToken, compilerNode.name, compilerNode.questionToken, compilerNode.typeParameters, compilerNode.parameters, compilerNode.type, compilerNode.body);
    }
    createApiOperationDecorator(factory, node, nodeArray, options, sourceFile, typeChecker) {
        if (!options.introspectComments) {
            return [];
        }
        const keyToGenerate = options.controllerKeyOfComment;
        const apiOperationDecorator = (0, plugin_utils_1.getDecoratorOrUndefinedByNames)([decorators_1.ApiOperation.name], nodeArray, factory);
        const apiOperationExpr = apiOperationDecorator &&
            (0, lodash_1.head)((0, ast_utils_1.getDecoratorArguments)(apiOperationDecorator));
        const apiOperationExprProperties = apiOperationExpr &&
            apiOperationExpr.properties;
        const extractedComments = (0, ast_utils_1.getMainCommentOfNode)(node, sourceFile);
        const tags = (0, ast_utils_1.getTsDocTagsOfNode)(node, sourceFile, typeChecker);
        const properties = [
            factory.createPropertyAssignment(keyToGenerate, factory.createStringLiteral(extractedComments)),
            ...(apiOperationExprProperties !== null && apiOperationExprProperties !== void 0 ? apiOperationExprProperties : factory.createNodeArray())
        ];
        const hasDeprecatedKey = (0, plugin_utils_1.hasPropertyKey)('deprecated', factory.createNodeArray(apiOperationExprProperties));
        if (!hasDeprecatedKey && tags.deprecated) {
            const deprecatedPropertyAssignment = factory.createPropertyAssignment('deprecated', (0, ast_utils_1.createLiteralFromAnyValue)(factory, tags.deprecated));
            properties.push(deprecatedPropertyAssignment);
        }
        const apiOperationDecoratorArguments = factory.createNodeArray([
            factory.createObjectLiteralExpression((0, lodash_1.compact)(properties))
        ]);
        if (apiOperationDecorator) {
            const expr = apiOperationDecorator.expression;
            const updatedCallExpr = factory.updateCallExpression(expr, expr.expression, undefined, apiOperationDecoratorArguments);
            return [factory.updateDecorator(apiOperationDecorator, updatedCallExpr)];
        }
        else {
            return [
                factory.createDecorator(factory.createCallExpression(factory.createIdentifier(`${plugin_constants_1.OPENAPI_NAMESPACE}.${decorators_1.ApiOperation.name}`), undefined, apiOperationDecoratorArguments))
            ];
        }
    }
    createDecoratorObjectLiteralExpr(factory, node, typeChecker, existingProperties = factory.createNodeArray(), hostFilename) {
        const properties = [
            ...existingProperties,
            this.createStatusPropertyAssignment(factory, node, existingProperties),
            this.createTypePropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename)
        ];
        return factory.createObjectLiteralExpression((0, lodash_1.compact)(properties));
    }
    createTypePropertyAssignment(factory, node, typeChecker, existingProperties, hostFilename) {
        if ((0, plugin_utils_1.hasPropertyKey)('type', existingProperties)) {
            return undefined;
        }
        const signature = typeChecker.getSignatureFromDeclaration(node);
        const type = typeChecker.getReturnTypeOfSignature(signature);
        if (!type) {
            return undefined;
        }
        let typeReference = (0, plugin_utils_1.getTypeReferenceAsString)(type, typeChecker);
        if (!typeReference) {
            return undefined;
        }
        if (typeReference.includes('node_modules')) {
            return undefined;
        }
        typeReference = (0, plugin_utils_1.replaceImportPath)(typeReference, hostFilename);
        return factory.createPropertyAssignment('type', factory.createIdentifier(typeReference));
    }
    createStatusPropertyAssignment(factory, node, existingProperties) {
        if ((0, plugin_utils_1.hasPropertyKey)('status', existingProperties)) {
            return undefined;
        }
        const statusNode = this.getStatusCodeIdentifier(factory, node);
        return factory.createPropertyAssignment('status', statusNode);
    }
    getStatusCodeIdentifier(factory, node) {
        const decorators = ts.canHaveDecorators
            ? ts.getDecorators(node)
            : node.decorators;
        const httpCodeDecorator = (0, plugin_utils_1.getDecoratorOrUndefinedByNames)(['HttpCode'], decorators, factory);
        if (httpCodeDecorator) {
            const argument = (0, lodash_1.head)((0, ast_utils_1.getDecoratorArguments)(httpCodeDecorator));
            if (argument) {
                return argument;
            }
        }
        const postDecorator = (0, plugin_utils_1.getDecoratorOrUndefinedByNames)(['Post'], decorators, factory);
        if (postDecorator) {
            return factory.createIdentifier('201');
        }
        return factory.createIdentifier('200');
    }
}
exports.ControllerClassVisitor = ControllerClassVisitor;
