import { Module } from '@nestjs/common';
import { LoginHistoryService } from './loginhistory.service';
import { LoginHistoryController } from './loginhistory.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [LoginHistoryController],
  providers: [LoginHistoryService, PrismaService],
})
export class LoginHistoryModule {}
