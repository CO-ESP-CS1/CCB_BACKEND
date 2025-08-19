import { Module } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { PersonneController } from './personne.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PersonneController],
  providers: [PersonneService, PrismaService],
})
export class PersonneModule {}