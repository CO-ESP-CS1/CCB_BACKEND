import { Module } from '@nestjs/common';
import { AssembleePlanningService } from './assembleeplanning.service';
import { AssembleePlanningController } from './assembleeplanning.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AssembleePlanningController],
  providers: [AssembleePlanningService, PrismaService],
})
export class AssembleePlanningModule {}
