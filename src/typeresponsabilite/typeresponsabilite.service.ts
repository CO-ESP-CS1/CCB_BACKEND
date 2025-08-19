// src/typeresponsabilite/typeresponsabilite.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTyperesponsabiliteDto } from './dto/create-typeresponsabilite.dto';
import { UpdateTyperesponsabiliteDto } from './dto/update-typeresponsabilite.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TyperesponsabiliteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTyperesponsabiliteDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as any; // assertion si besoin, sinon adapter selon modèle

    return this.prisma.typeresponsabilite.create({ data });
  }

  async findAll() {
    return this.prisma.typeresponsabilite.findMany();
  }

  async findOne(id: number) {
    const record = await this.prisma.typeresponsabilite.findUnique({
      where: { idtyperesponsabilite: id },
    });
    if (!record) throw new NotFoundException(`Typeresponsabilite #${id} not found`);
    return record;
  }

  async update(id: number, dto: UpdateTyperesponsabiliteDto) {
    await this.findOne(id);
  
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.typeresponsabiliteUpdateInput;  // ou typeresponsabiliteUncheckedUpdateInput
  
    return this.prisma.typeresponsabilite.update({
      where: { idtyperesponsabilite: id },
      data,
    });
  }
  

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.typeresponsabilite.delete({
      where: { idtyperesponsabilite: id },
    });
  }
}
