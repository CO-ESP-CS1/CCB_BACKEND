import { Module } from '@nestjs/common';
import { ActiviteService } from './activite.service';
import { ActiviteController } from './activite.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ActiviteController],
  providers: [ActiviteService, PrismaService],
})
export class ActiviteModule {}
