import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MemberAssembleeId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    // Assure-toi que dans ton JWT, la propriété s’appelle bien 'idassemblee' (ou adapte ici)
    return request.user?.idassemblee ?? null;
  },
);
