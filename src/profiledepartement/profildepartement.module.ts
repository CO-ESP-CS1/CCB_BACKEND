// src/profildepartement/profildepartement.module.ts
import { Module } from '@nestjs/common';
import { ProfilDepartementService } from './profildepartement.service';
import { ProfilDepartementController } from './profildepartement.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProfilDepartementController],
  providers: [ProfilDepartementService, PrismaService],
})
export class ProfilDepartementModule {}
