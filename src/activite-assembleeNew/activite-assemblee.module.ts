import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActiviteAssembleeController } from './activite-assemblee.controller';
import { ActiviteAssembleeService } from './activite-assemblee.service';

@Module({
  controllers: [ActiviteAssembleeController],
  providers: [ActiviteAssembleeService, PrismaService],
})
export class ActiviteAssembleeModuleNew {}
