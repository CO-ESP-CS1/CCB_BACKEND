import { Module } from '@nestjs/common';
import { MembreBadgeService } from './membre-badge.service';
import { MembreBadgeController } from './membre-badge.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MembreBadgeController],
  providers: [MembreBadgeService, PrismaService],
})
export class MembreBadgeModule {}
