import { Module } from '@nestjs/common';
import { VilleService } from './ville.service';
import { VilleController } from './ville.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [VilleController],
  providers: [VilleService, PrismaService],
})
export class VilleModule {}
