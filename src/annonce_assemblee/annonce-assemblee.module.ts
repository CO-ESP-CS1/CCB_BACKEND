import { Module } from '@nestjs/common';
import { AnnonceAssembleeService } from './annonce-assemblee.service';
import { AnnonceAssembleeController } from './annonce-assemblee.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AnnonceAssembleeController],
  providers: [AnnonceAssembleeService, PrismaService],
})
export class AnnonceAssembleeModule {}
