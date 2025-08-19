// src/typeannonce/typeannonce.module.ts
import { Module } from '@nestjs/common';
import { TypeannonceService } from './typeannonce.service';
import { TypeannonceController } from './typeannonce.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TypeannonceController],
  providers: [TypeannonceService, PrismaService],
})
export class TypeannonceModule {}
