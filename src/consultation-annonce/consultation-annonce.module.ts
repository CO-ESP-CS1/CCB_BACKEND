import { Module } from '@nestjs/common';
import { ConsultationAnnonceService } from './consultation-annonce.service';
import { ConsultationAnnonceController } from './consultation-annonce.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConsultationAnnonceController],
  providers: [ConsultationAnnonceService],
})
export class ConsultationAnnonceModule {}