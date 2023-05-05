import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';
import { plainToJson } from './../../utils/transformers/to-json';
import { Document } from 'mongoose';

/**
 * Returns a class that extends the Nest.js `ClassSerializerInterceptor` and is able to serialize Mongoose documents.
 * @param classToIntercept The class that will be used to intercept the serialization process.
 * @returns A class that can intercept the serialization process for Mongoose documents.
 */
export function MongooseSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    /**
     * Changes the plain object to an instance of the class that is passed as a parameter.
     * @param document The plain object to be changed.
     * @returns The new instance of the class.
     */
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        if (document === undefined) {
          return document;
        }
        if (document === null) {
          return document;
        }
        Object.keys(document).forEach((key) => {
          if (Array.isArray(document[key])) {
            document[key] = document[key].map((d) =>
              this.changePlainObjectToClass(d),
            );
          }
          if (document[key] instanceof Document) {
            document[key] = plainToJson(classToIntercept, document[key]);
          }
        });
        return document;
      }

      return plainToJson(classToIntercept, document);
    }

    /**
     * Prepares the response for serialization.
     * @param response The response to be prepared.
     * @returns The prepared response.
     */
    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (Array.isArray(response)) {
        return response.map((r) => this.changePlainObjectToClass(r));
      }

      return this.changePlainObjectToClass(response);
    }

    /**
     * Serializes the response object or array of objects.
     * @param response The object or array of objects to be serialized.
     * @param options The serialization options.
     * @returns The serialized response.
     */
    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
