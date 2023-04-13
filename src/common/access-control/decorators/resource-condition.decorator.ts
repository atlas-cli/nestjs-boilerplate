import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResourceConditions } from '../types/resource-condition';

export const ResourceCondition = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ResourceConditions => {
    const request = ctx.switchToHttp().getRequest();
    return request.resourceConditions;
  },
);
