import { Module } from '@nestjs/common';
import { PaysService } from './pays.service';
import { PaysController } from './pays.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PaysController],
  providers: [PaysService, PrismaService],
})
export class PaysModule {}
