import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenPayload = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // le payload décodé par le guard

    if (!user) {
      return null; // ou throw UnauthorizedException selon besoin
    }

    if (field) {
      return user[field];
    }
    return user;
  },
);
