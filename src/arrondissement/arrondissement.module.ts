import { Module } from '@nestjs/common';
import { ArrondissementService } from './arrondissement.service';
import { ArrondissementController } from './arrondissement.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ArrondissementController],
  providers: [ArrondissementService, PrismaService],
})
export class ArrondissementModule {}
