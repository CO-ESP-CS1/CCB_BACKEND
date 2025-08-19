// src/live/live.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LiveService } from './live.service';
import { LiveController } from './live.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // si besoin, sinon retire

@Module({
  controllers: [LiveController],
  providers: [LiveService, PrismaService],
  exports: [LiveService],
})
export class LiveNewModule {}
