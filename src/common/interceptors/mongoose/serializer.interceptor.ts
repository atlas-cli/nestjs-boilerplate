import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { plainToJson } from './../../utils/transformers/to-json';
import { Document } from 'mongoose';

export function MongooseSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        if (document === undefined) {
          return document;
        }
        Object.keys(document).forEach((key) => {
          if (document[key] instanceof Document) {
            document[key] = plainToJson(classToIntercept, document[key]);
          }
        });
        return document;
      }

      return plainToJson(classToIntercept, document);
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map(this.changePlainObjectToClass);
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
