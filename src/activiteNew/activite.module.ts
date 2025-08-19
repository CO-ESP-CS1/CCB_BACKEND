import { Module } from '@nestjs/common';
import { ActiviteService } from './activite.service';
import { ActiviteController } from './activite.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // <== importer ici

@Module({
  imports: [CloudinaryModule],   // <== importer ici
  controllers: [ActiviteController],
  providers: [ActiviteService, PrismaService],
})
export class ActiviteNewModule {}
