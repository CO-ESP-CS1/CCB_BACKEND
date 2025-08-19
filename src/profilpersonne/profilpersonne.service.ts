// src/profilpersonne/profilpersonne.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProfilPersonneDto } from './dto/create-profilpersonne.dto';
import { UpdateProfilPersonneDto } from './dto/update-profilpersonne.dto';

@Injectable()
export class ProfilPersonneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfilPersonneDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.profilpersonneUncheckedCreateInput;

    return this.prisma.profilpersonne.create({ data });
  }

  async findAll() {
    return this.prisma.profilpersonne.findMany();
  }

  async findOne(id: number) {
    return this.prisma.profilpersonne.findUnique({
      where: { idprofilpersonne: id },
    });
  }

  async update(id: number, dto: UpdateProfilPersonneDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.profilpersonneUncheckedUpdateInput;

    return this.prisma.profilpersonne.update({
      where: { idprofilpersonne: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.profilpersonne.delete({
      where: { idprofilpersonne: id },
    });
  }
}
