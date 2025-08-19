import { Module } from '@nestjs/common';
import { ConnexionService } from './connexion.service';
import { ConnexionController } from './connexion.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ConnexionController],
  providers: [ConnexionService, PrismaService],
})
export class ConnexionModule {}
