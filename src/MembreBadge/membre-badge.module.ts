import { Module } from '@nestjs/common';
import { BadgeService } from './membre-badge.service';
import { BadgeController } from './membre-badge.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class MembreBadgeNewModule {}