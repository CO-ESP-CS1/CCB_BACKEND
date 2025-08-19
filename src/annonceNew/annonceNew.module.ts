import { Module } from '@nestjs/common';
import { AnnonceController } from './annonceNew.controller';
import { AnnonceService } from './annonceNew.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; 

@Module({
  imports: [CloudinaryModule],
  controllers: [AnnonceController],
  providers: [AnnonceService, PrismaService],  // Ajout du PrismaService ici
})
export class AnnonceNewModule {}
