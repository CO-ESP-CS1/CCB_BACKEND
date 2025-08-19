import { Module } from '@nestjs/common';
import { AuthService } from './recuperation.service';
import { RecuperationController } from './recuperation.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RecuperationController],
  providers: [AuthService, PrismaService],
})
export class RecuperationModule {}
