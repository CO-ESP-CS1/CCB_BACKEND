import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnnonceService {
  constructor(private prisma: PrismaService) {}

  
  async create(data: CreateAnnonceDto) {
    const { idmembre, idtypeannonce, ...rest } = data;
  
    return this.prisma.annonce.create({
      data: {
        ...rest,
        datepublication: data.datepublication ? new Date(data.datepublication) : undefined,
        membre: { connect: { idmembre } },
        typeannonce: { connect: { idtypeannonce } },
      } as Prisma.annonceCreateInput, // Assertion nécessaire car Prisma ne détecte pas bien le type avec connect()
    });
  }
  findAll() {
    return this.prisma.annonce.findMany({
      include: { membre: true, typeannonce: true },
    });
  }

  async findOne(id: number) {
    const record = await this.prisma.annonce.findUnique({
      where: { idannonce: id },
      include: { membre: true, typeannonce: true },
    });
    if (!record) throw new NotFoundException(`Annonce ${id} introuvable`);
    return record;
  }

  async update(id: number, data: UpdateAnnonceDto) {
    await this.ensureExists(id);
    return this.prisma.annonce.update({
      where: { idannonce: id },
      data: {
        ...data,
        datepublication: data.datepublication ? new Date(data.datepublication) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.annonce.delete({
      where: { idannonce: id },
    });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.annonce.findUnique({ where: { idannonce: id } });
    if (!found) throw new NotFoundException(`Annonce ${id} introuvable`);
  }
}
