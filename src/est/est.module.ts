import { Module } from '@nestjs/common';
import { EstService } from './est.service';
import { EstController } from './est.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EstController],
  providers: [EstService, PrismaService],
})
export class EstModule {}
