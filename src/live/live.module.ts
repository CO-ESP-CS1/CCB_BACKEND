import { Module } from '@nestjs/common';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [LiveController],
  providers: [LiveService, PrismaService],
})
export class LiveModule {}
