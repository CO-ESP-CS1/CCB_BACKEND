// src/common/decorators/member-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MemberId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.idmembre; // adapter selon la structure du user dans token
  },
);
