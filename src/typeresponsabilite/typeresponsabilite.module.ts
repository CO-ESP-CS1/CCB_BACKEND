// src/typeresponsabilite/typeresponsabilite.module.ts
import { Module } from '@nestjs/common';
import { TyperesponsabiliteService } from './typeresponsabilite.service';
import { TyperesponsabiliteController } from './typeresponsabilite.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TyperesponsabiliteController],
  providers: [TyperesponsabiliteService, PrismaService],
})
export class TyperesponsabiliteModule {}
