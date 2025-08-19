// src/typeactivites/typeactivites.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateTypeactivitesDto } from './dto/create-typeactivites.dto';
import { UpdateTypeactivitesDto } from './dto/update-typeactivites.dto';

@Injectable()
export class TypeactivitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTypeactivitesDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.typeactivitesUncheckedCreateInput;

    return this.prisma.typeactivites.create({ data });
  }

  async findAll() {
    return this.prisma.typeactivites.findMany();
  }

  async findOne(id: number) {
    return this.prisma.typeactivites.findUnique({
      where: { idtypeactivites: id },
    });
  }

  async update(id: number, dto: UpdateTypeactivitesDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.typeactivitesUncheckedUpdateInput;

    return this.prisma.typeactivites.update({
      where: { idtypeactivites: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.typeactivites.delete({
      where: { idtypeactivites: id },
    });
  }
}
