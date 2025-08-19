// src/profilpersonne/profilpersonne.module.ts
import { Module } from '@nestjs/common';
import { ProfilPersonneService } from './profilpersonne.service';
import { ProfilPersonneController } from './profilpersonne.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProfilPersonneController],
  providers: [ProfilPersonneService, PrismaService],
})
export class ProfilPersonneModule {}
