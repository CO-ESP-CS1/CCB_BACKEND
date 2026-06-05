import { Module } from '@nestjs/common';
import { AssemblyLocalController } from './assembly-local.controller';
import { AssemblyLocalService } from './assembly-local.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AssemblyLocalController],
  providers: [AssemblyLocalService, PrismaService],
  exports: [AssemblyLocalService],
})
export class AssemblyLocalModule {}
