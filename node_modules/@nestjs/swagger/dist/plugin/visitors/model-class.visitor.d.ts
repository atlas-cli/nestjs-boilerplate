import * as ts from 'typescript';
import { PropertyAssignment } from 'typescript';
import { PluginOptions } from '../merge-options';
import { AbstractFileVisitor } from './abstract.visitor';
declare type ClassMetadata = Record<string, ts.ObjectLiteralExpression>;
export declare class ModelClassVisitor extends AbstractFileVisitor {
    visit(sourceFile: ts.SourceFile, ctx: ts.TransformationContext, program: ts.Program, options: PluginOptions): ts.SourceFile;
    addMetadataFactory(factory: ts.NodeFactory, node: ts.ClassDeclaration, classMetadata: ClassMetadata): any;
    inspectPropertyDeclaration(factory: ts.NodeFactory, compilerNode: ts.PropertyDeclaration, typeChecker: ts.TypeChecker, options: PluginOptions, hostFilename: string, sourceFile: ts.SourceFile, metadata: ClassMetadata): void;
    createDecoratorObjectLiteralExpr(factory: ts.NodeFactory, node: ts.PropertyDeclaration | ts.PropertySignature, typeChecker: ts.TypeChecker, existingProperties?: ts.NodeArray<ts.PropertyAssignment>, options?: PluginOptions, hostFilename?: string, sourceFile?: ts.SourceFile): ts.ObjectLiteralExpression;
    private createTypePropertyAssignments;
    createEnumPropertyAssignment(factory: ts.NodeFactory, node: ts.PropertyDeclaration | ts.PropertySignature, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.PropertyAssignment | ts.PropertyAssignment[];
    createDefaultPropertyAssignment(factory: ts.NodeFactory, node: ts.PropertyDeclaration | ts.PropertySignature, existingProperties: ts.NodeArray<ts.PropertyAssignment>): ts.PropertyAssignment;
    createValidationPropertyAssignments(factory: ts.NodeFactory, node: ts.PropertyDeclaration | ts.PropertySignature): ts.PropertyAssignment[];
    addPropertyByValidationDecorator(factory: ts.NodeFactory, decoratorName: string, propertyKey: string, decorators: ts.NodeArray<ts.Decorator>, assignments: ts.PropertyAssignment[]): void;
    addPropertiesByValidationDecorator(factory: ts.NodeFactory, decoratorName: string, decorators: ts.NodeArray<ts.Decorator>, assignments: ts.PropertyAssignment[], addPropertyAssignments: (decoratorRef: ts.Decorator) => PropertyAssignment[]): void;
    addClassMetadata(node: ts.PropertyDeclaration, objectLiteral: ts.ObjectLiteralExpression, sourceFile: ts.SourceFile, metadata: ClassMetadata): void;
    createDescriptionAndTsDocTagPropertyAssigments(factory: ts.NodeFactory, node: ts.PropertyDeclaration | ts.PropertySignature, typeChecker: ts.TypeChecker, existingProperties?: ts.NodeArray<ts.PropertyAssignment>, options?: PluginOptions, sourceFile?: ts.SourceFile): ts.PropertyAssignment[];
}
export {};
