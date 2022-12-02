"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const logger = new common_1.Logger('TypeHelpers');
function applyIsOptionalDecorator(targetClass, propertyKey) {
    if (!isClassValidatorAvailable()) {
        return;
    }
    const classValidator = require('class-validator');
    const decoratorFactory = classValidator.IsOptional();
    decoratorFactory(targetClass.prototype, propertyKey);
}
exports.applyIsOptionalDecorator = applyIsOptionalDecorator;
function inheritValidationMetadata(parentClass, targetClass, isPropertyInherited) {
    if (!isClassValidatorAvailable()) {
        return;
    }
    try {
        const classValidator = require('class-validator');
        const metadataStorage = classValidator.getFromContainer(classValidator.MetadataStorage);
        const targetMetadata = metadataStorage.getTargetValidationMetadatas(parentClass, null);
        targetMetadata
            .filter(({ propertyName }) => !isPropertyInherited || isPropertyInherited(propertyName))
            .forEach((value) => metadataStorage.addValidationMetadata(Object.assign(Object.assign({}, value), { target: targetClass })));
    }
    catch (err) {
        logger.error(`Validation ("class-validator") metadata cannot be inherited for "${parentClass.name}" class.`);
        logger.error(err);
    }
}
exports.inheritValidationMetadata = inheritValidationMetadata;
function inheritTransformationMetadata(parentClass, targetClass, isPropertyInherited) {
    if (!isClassTransformerAvailable()) {
        return;
    }
    try {
        const transformMetadataKeys = [
            '_excludeMetadatas',
            '_exposeMetadatas',
            '_transformMetadatas',
            '_typeMetadatas'
        ];
        transformMetadataKeys.forEach((key) => inheritTransformerMetadata(key, parentClass, targetClass, isPropertyInherited));
    }
    catch (err) {
        logger.error(`Transformer ("class-transformer") metadata cannot be inherited for "${parentClass.name}" class.`);
        logger.error(err);
    }
}
exports.inheritTransformationMetadata = inheritTransformationMetadata;
function inheritTransformerMetadata(key, parentClass, targetClass, isPropertyInherited) {
    const classTransformer = require('class-transformer/storage');
    const metadataStorage = classTransformer.defaultMetadataStorage;
    if (metadataStorage[key].has(parentClass)) {
        const metadataMap = metadataStorage[key];
        const parentMetadata = metadataMap.get(parentClass);
        const targetMetadataEntries = Array.from(parentMetadata.entries())
            .filter(([key]) => !isPropertyInherited || isPropertyInherited(key))
            .map(([key, metadata]) => {
            if (Array.isArray(metadata)) {
                const targetMetadata = metadata.map((item) => (Object.assign(Object.assign({}, item), { target: targetClass })));
                return [key, targetMetadata];
            }
            return [key, Object.assign(Object.assign({}, metadata), { target: targetClass })];
        });
        metadataMap.set(targetClass, new Map(targetMetadataEntries));
    }
}
function isClassValidatorAvailable() {
    try {
        require('class-validator');
        return true;
    }
    catch (_a) {
        return false;
    }
}
function isClassTransformerAvailable() {
    try {
        require('class-transformer');
        return true;
    }
    catch (_a) {
        return false;
    }
}
