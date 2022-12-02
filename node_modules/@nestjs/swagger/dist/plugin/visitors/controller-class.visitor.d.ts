import * as ts from 'typescript';
import { PluginOptions } from '../merge-options';
import { AbstractFileVisitor } from './abstract.visitor';
export declare class ControllerClassVisitor extends AbstractFileVisitor {
    visit(sourceFile: ts.SourceFile, ctx: ts.TransformationContext, program: ts.Program, options: PluginOptions): ts.SourceFile;
    addDecoratorToNode(factory: ts.NodeFactory, compilerNode: ts.MethodDeclaration, typeChecker: ts.TypeChecker, options: PluginOptions, hostFilename: string, sourceFile: ts.SourceFile): ts.MethodDeclaration;
    createApiOperationDecorator(factory: ts.NodeFactory, node: ts.MethodDeclaration, nodeArray: ts.NodeArray<ts.Decorator>, options: PluginOptions, sourceFile: ts.SourceFile, typeChecker: ts.TypeChecker): ts.Decorator[];
    createDecoratorObjectLiteralExpr(factory: ts.NodeFactory, node: ts.MethodDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.ObjectLiteralExpression;
    createTypePropertyAssignment(factory: ts.NodeFactory, node: ts.MethodDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.PropertyAssignment;
    createStatusPropertyAssignment(factory: ts.NodeFactory, node: ts.MethodDeclaration, existingProperties: ts.NodeArray<ts.PropertyAssignment>): ts.PropertyAssignment;
    getStatusCodeIdentifier(factory: ts.NodeFactory, node: ts.MethodDeclaration): any;
}
