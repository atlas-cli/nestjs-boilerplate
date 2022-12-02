import { ValidationError } from '@nestjs/common';
export declare const mapChildrenToValidationErrors: (error: ValidationError, parentPath?: string) => ValidationError[];
