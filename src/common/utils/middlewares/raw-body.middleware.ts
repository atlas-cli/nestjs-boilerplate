import { Injectable, NestMiddleware, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: RawBodyRequest<Request>, res: Response, next: () => any) {
    req.body = req.rawBody;
    next();
  }
}
