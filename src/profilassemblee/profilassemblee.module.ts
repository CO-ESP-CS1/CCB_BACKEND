// src/profilassemblee/profilassemblee.module.ts
import { Module } from '@nestjs/common';
import { ProfilassembleeService } from './profilassemblee.service';
import { ProfilassembleeController } from './profilassemblee.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProfilassembleeController],
  providers: [ProfilassembleeService, PrismaService],
})
export class ProfilassembleeModule {}
