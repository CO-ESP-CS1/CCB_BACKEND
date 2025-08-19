import { Module } from '@nestjs/common';
import { AssembleeService } from './assemblee.service';
import { AssembleeController } from './assemblee.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AssembleeController],
  providers: [AssembleeService, PrismaService],
})
export class AssembleeModule {}
