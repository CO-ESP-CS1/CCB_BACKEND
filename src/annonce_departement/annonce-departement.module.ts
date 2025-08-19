import { Module } from '@nestjs/common';
import { AnnonceDepartementService } from './annonce-departement.service';
import { AnnonceDepartementController } from './annonce-departement.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AnnonceDepartementController],
  providers: [AnnonceDepartementService, PrismaService],
})
export class AnnonceDepartementModule {}
