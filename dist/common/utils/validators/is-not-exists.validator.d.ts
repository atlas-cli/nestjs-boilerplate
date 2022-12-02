import { ValidatorConstraintInterface } from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
export declare class IsNotExist implements ValidatorConstraintInterface {
    private dataSource;
    constructor(dataSource: DataSource);
    validate(value: string, validationArguments: ValidationArguments): Promise<boolean>;
}
