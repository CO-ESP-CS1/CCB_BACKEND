// user-payload.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPayload = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // le payload du token décodé par ton AuthGuard
    return data ? user?.[data] : user;
  },
);
