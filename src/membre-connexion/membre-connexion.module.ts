import { Module } from '@nestjs/common';
import { MembreConnexionService } from './membre-connexion.service';
import { MembreConnexionController } from './membre-connexion.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembreConnexionController],
  providers: [MembreConnexionService],
})
export class MembreConnexionModule {}