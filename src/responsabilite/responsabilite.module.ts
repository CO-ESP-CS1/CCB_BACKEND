// src/responsabilite/responsabilite.module.ts
import { Module } from '@nestjs/common';
import { ResponsabiliteService } from './responsabilite.service';
import { ResponsabiliteController } from './responsabilite.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ResponsabiliteController],
  providers: [ResponsabiliteService, PrismaService],
})
export class ResponsabiliteModule {}
