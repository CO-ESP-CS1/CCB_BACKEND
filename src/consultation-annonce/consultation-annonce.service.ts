import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConsultationAnnonceDto } from './dto/create-consultation-annonce.dto';
import { ConsultationAnnonceDto } from './dto/consultation-annonce.dto';

@Injectable()
export class ConsultationAnnonceService {
  constructor(private prisma: PrismaService) {}

async create(createDto: CreateConsultationAnnonceDto): Promise<ConsultationAnnonceDto> {
  if (!createDto.idmembre || !createDto.idannonce) {
    throw new Error("idmembre et idannonce doivent être fournis");
  }

  return this.prisma.consultation_annonce.create({
    data: {
      membre: {
        connect: { idmembre: createDto.idmembre }, // clé primaire de membre
      },
      annonce: {
        connect: { idannonce: createDto.idannonce }, // clé primaire de annonce
      },
    },
  });
}



  async findByMembre(idmembre: number): Promise<ConsultationAnnonceDto[]> {
    return this.prisma.consultation_annonce.findMany({
      where: { idmembre },
    });
  }

  async findByAnnonce(idannonce: number): Promise<ConsultationAnnonceDto[]> {
    return this.prisma.consultation_annonce.findMany({
      where: { idannonce },
    });
  }

  async findOne(
    idconsultation: number,
  ): Promise<ConsultationAnnonceDto | null> {
    return this.prisma.consultation_annonce.findUnique({
      where: { idconsultation },
    });
  }

  async remove(idconsultation: number): Promise<void> {
    await this.prisma.consultation_annonce.delete({
      where: { idconsultation },
    });
  }
}