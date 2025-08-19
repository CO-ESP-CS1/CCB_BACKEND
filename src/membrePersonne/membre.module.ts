import { Module } from '@nestjs/common';
import { MembreService } from './membre.service';
import { MembreController } from './membre.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MembreController],
  providers: [MembreService, PrismaService],
})
export class MembreModulePersonne {}
