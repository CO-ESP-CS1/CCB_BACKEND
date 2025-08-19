import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ParticipationController],
  providers: [ParticipationService, PrismaService],
})
export class ParticipationModule {}