import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEstDto } from './dto/create-est.dto';
import { UpdateEstDto } from './dto/update-est.dto';

@Injectable()
export class EstService {
  constructor(private readonly prisma: PrismaService) {}

async create(dto: CreateEstDto) {
  // Chercher le membre via son code
  const membre = await this.prisma.membre.findUnique({
    where: { codemembre: dto.code },
  });

  if (!membre) {
    throw new NotFoundException(`Membre avec le code ${dto.code} introuvable`);
  }

  // Vérifier si l'association existe déjà
  const existing = await this.prisma.est.findFirst({
    where: {
      idmembre: membre.idmembre,
      iddepartement: dto.iddepartement,
      dateattribution: dto.dateattribution ?? null,
    },
  });

  if (existing) {
    throw new Error('Cette attribution existe déjà.');
  }

  // Créer l'enregistrement avec l'idmembre trouvé
  return this.prisma.est.create({
    data: {
      idmembre: membre.idmembre,
      iddepartement: dto.iddepartement,
      dateattribution: dto.dateattribution,
    },
  });
}

  async findAll() {
    return this.prisma.est.findMany({
      include: { membre: true, departement: true },
    });
  }

  async findOne(idmembre: number, iddepartement: number) {
    const est = await this.prisma.est.findUnique({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      include: { membre: true, departement: true },
    });
    if (!est) throw new NotFoundException('Est not found');
    return est;
  }

  async update(idmembre: number, iddepartement: number, dto: UpdateEstDto) {
    return this.prisma.est.update({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      data: dto,
    });
  }

  async remove(idmembre: number, iddepartement: number) {
    return this.prisma.est.delete({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
    });
  }
}
