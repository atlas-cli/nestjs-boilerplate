import { MiddlewareConsumer } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';

export const applyRawBodyOnlyTo = (
  consumer: MiddlewareConsumer,
  ...rawBodyRoutes: (string | RouteInfo)[]
) => {
  consumer.apply(RawBodyMiddleware).forRoutes(...rawBodyRoutes);
};
