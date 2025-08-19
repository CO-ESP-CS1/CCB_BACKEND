// src/responsabilite/responsabilite.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateResponsabiliteDto } from './dto/create-responsabilite.dto';
import { UpdateResponsabiliteDto } from './dto/update-responsabilite.dto';

@Injectable()
export class ResponsabiliteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateResponsabiliteDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.responsabiliteUncheckedCreateInput;

    return this.prisma.responsabilite.create({ data });
  }

  async findAll() {
    return this.prisma.responsabilite.findMany();
  }

  async findOne(id: number) {
    return this.prisma.responsabilite.findUnique({
      where: { idresponsable: id },
    });
  }

  async update(id: number, dto: UpdateResponsabiliteDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.responsabiliteUncheckedUpdateInput;

    return this.prisma.responsabilite.update({
      where: { idresponsable: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.responsabilite.delete({
      where: { idresponsable: id },
    });
  }
}
