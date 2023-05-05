import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MongooseExceptionInterceptor implements NestInterceptor {
  /**
   * Verifies if a document has been serialized, otherwise it throws a BadGatewayException
   * @param document - The document to be verified
   * @returns The verified document
   */
  private verifyHaveDocument(document: any): any {
    if (document === undefined) {
      return document;
    }
    if (document._doc === undefined) {
      Object.keys(document).forEach((key) => {
        if (document[key] === undefined) {
          return;
        }
        if (Array.isArray(document[key])) {
          document[key].map((document) => {
            return this.verifyHaveDocument(document);
          });
        }
        if (document[key]?._doc !== undefined) {
          this.throwBadGateway();
        }
      });
      return document;
    }

    this.throwBadGateway();
  }

  /**
   * Throws a BadGatewayException
   */
  throwBadGateway(): void {
    throw new BadGatewayException(
      'You cannot return a MongoDB document without serializing it with `classToJson` or with an interceptor',
    );
  }

  /**
   * Verifies if a response is an array or a single document, and verifies if each document is serialized
   * @param response - The response to be verified
   * @returns The verified response
   */
  private verifyIsArray(response: any | any[]): any | any[] {
    if (response === undefined) {
      return response;
    }
    if (Array.isArray(response)) {
      return response.map((d) => this.verifyHaveDocument(d));
    }

    return this.verifyHaveDocument(response);
  }

  /**
   * Intercepts the incoming request and verifies the response
   * @param _: The ExecutionContext instance
   * @param next - The CallHandler instance
   * @returns The Observable of the verified response
   */
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((response) => this.verifyIsArray(response)));
  }
}
