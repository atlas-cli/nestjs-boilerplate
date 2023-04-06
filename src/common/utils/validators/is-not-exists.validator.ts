import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Document } from 'mongoose';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const modelName = validationArguments.constraints[0];
    const currentValue = validationArguments.object as ValidationEntity;

    const model: Document = await this.connection
      .model(modelName.toString())
      .findOne({
        [validationArguments.property]: value,
      });

    if (model?._id === currentValue?.id) {
      return true;
    }
    return !model;
  }
}
