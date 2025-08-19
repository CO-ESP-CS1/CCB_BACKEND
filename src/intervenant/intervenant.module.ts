import { Module } from '@nestjs/common';
import { IntervenantService } from './intervenant.service';
import { IntervenantController } from './intervenant.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [IntervenantController],
  providers: [IntervenantService, PrismaService],
})
export class IntervenantModule {}
