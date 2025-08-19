// src/typeactivites/typeactivites.module.ts
import { Module } from '@nestjs/common';
import { TypeactivitesService } from './typeactivites.service';
import { TypeactivitesController } from './typeactivites.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TypeactivitesController],
  providers: [TypeactivitesService, PrismaService],
})
export class TypeactivitesModule {}
