import { Module } from '@nestjs/common';
import { DirigeService } from './dirige.service';
import { DirigeController } from './dirige.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DirigeController],
  providers: [DirigeService, PrismaService],
})
export class DirigeModule {}
