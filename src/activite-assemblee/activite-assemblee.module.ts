import { Module } from '@nestjs/common';
import { ActiviteAssembleeService } from './activite-assemblee.service';
import { ActiviteAssembleeController } from './activite-assemblee.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ActiviteAssembleeController],
  providers: [ActiviteAssembleeService, PrismaService],
})
export class ActiviteAssembleeModule {}
