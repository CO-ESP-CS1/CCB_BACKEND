import { Module } from '@nestjs/common';
import { RegenerationController } from './regeneration.controller';
import { RegenerationService } from './regeneration.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RegenerationController],
  providers: [RegenerationService, PrismaService],
})
export class RegenerationModule {}
