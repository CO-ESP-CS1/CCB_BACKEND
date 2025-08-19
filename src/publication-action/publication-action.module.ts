// src/publication-action/publication-action.module.ts
import { Module } from '@nestjs/common';
import { PublicationActionService } from './publication-action.service';
import { PublicationActionController } from './publication-action.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PublicationActionController],
  providers: [PublicationActionService, PrismaService],
})
export class PublicationActionModule {}
