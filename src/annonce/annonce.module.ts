import { Module } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AnnonceController],
  providers: [AnnonceService, PrismaService],
})
export class AnnonceModule {}
