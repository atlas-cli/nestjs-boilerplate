import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class MongooseExceptionInteceptor implements NestInterceptor {
  private verifyHaveDocument(document: any) {
    if (document === undefined) {
      return document;
    }
    if (document._doc === undefined) {
      Object.keys(document).forEach((key) => {
        if (document[key] === undefined) {
          return;
        }
        if (document[key]._doc !== undefined) {
          this.throwBadGateway();
        }
      });
      return document;
    }

    this.throwBadGateway();
  }

  throwBadGateway() {
    throw new BadGatewayException(
      'you cannot return a mongodb document without serializing it with classToJson or with an interceptor',
    );
  }

  private verifyIsArray(response: any | any[]) {
    if (response === undefined) {
      return response;
    }
    if (Array.isArray(response)) {
      return response.map(this.verifyHaveDocument);
    }

    return this.verifyHaveDocument(response);
  }
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((response) => this.verifyIsArray(response)));
  }
}
