import { Module } from '@nestjs/common';
import { ParticipeService } from './participe.service';
import { ParticipeController } from './participe.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ParticipeController],
  providers: [ParticipeService, PrismaService],
})
export class ParticipeModule {}
