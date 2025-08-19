import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateAnnonceDepartementDto } from './dto/create-annonce-departement.dto';

@Injectable()
export class AnnonceDepartementService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAnnonceDepartementDto) {
    return this.prisma.annonce_departement.create({
      data: {
        dateciblage: data.dateciblage ? new Date(data.dateciblage) : undefined,
        annonce: { connect: { idannonce: data.idannonce } },
        departement: { connect: { iddepartement: data.iddepartement } },
      } as Prisma.annonce_departementCreateInput,
    });
  }

  findAll() {
    return this.prisma.annonce_departement.findMany({
      include: { annonce: true, departement: true },
    });
  }

  findOne(idannonce: number, iddepartement: number) {
    return this.prisma.annonce_departement.findUnique({
      where: { idannonce_iddepartement: { idannonce, iddepartement } },
      include: { annonce: true, departement: true },
    });
  }

  async remove(idannonce: number, iddepartement: number) {
    await this.ensureExists(idannonce, iddepartement);
    return this.prisma.annonce_departement.delete({
      where: { idannonce_iddepartement: { idannonce, iddepartement } },
    });
  }

  private async ensureExists(idannonce: number, iddepartement: number) {
    const found = await this.prisma.annonce_departement.findUnique({
      where: { idannonce_iddepartement: { idannonce, iddepartement } },
    });
    if (!found) throw new NotFoundException(`Relation annonce ${idannonce} - departement ${iddepartement} introuvable`);
  }
}
