import { Module } from '@nestjs/common';
import { CodeRecuperationService } from './coderecuperation.service';
import { CodeRecuperationController } from './coderecuperation.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CodeRecuperationController],
  providers: [CodeRecuperationService, PrismaService],
})
export class CodeRecuperationModule {}
