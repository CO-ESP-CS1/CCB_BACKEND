// src/profildepartement/profildepartement.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfilDepartementDto } from './dto/create-profildepartement.dto';
import { UpdateProfilDepartementDto } from './dto/update-profildepartement.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfilDepartementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfilDepartementDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.profildepartementUncheckedCreateInput;

    return this.prisma.profildepartement.create({ data });
  }

  async findAll() {
    return this.prisma.profildepartement.findMany();
  }

  async findOne(id: number) {
    return this.prisma.profildepartement.findUnique({
      where: { idprofildepartement: id },
    });
  }

  async update(id: number, dto: UpdateProfilDepartementDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.profildepartementUncheckedUpdateInput;

    return this.prisma.profildepartement.update({
      where: { idprofildepartement: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.profildepartement.delete({
      where: { idprofildepartement: id },
    });
  }
}
