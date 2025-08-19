// src/typeannonce/typeannonce.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTypeannonceDto } from './dto/create-typeannonce.dto';
import { UpdateTypeannonceDto } from './dto/update-typeannonce.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TypeannonceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTypeannonceDto) {
    const data = {
        ...dto,
        createat: new Date(),
        updateat: new Date(),
      } as Prisma.typeannonceCreateInput;
      
      return this.prisma.typeannonce.create({ data });
      
  }
  
  findAll() {
    return this.prisma.typeannonce.findMany();
  }

  findOne(id: number) {
    return this.prisma.typeannonce.findUnique({
      where: { idtypeannonce: id },
    });
  }

  async update(id: number, dto: UpdateTypeannonceDto) {
    const data: Prisma.typeannonceUncheckedUpdateInput = {
      ...dto,
      updateat: new Date(),
    };
    return this.prisma.typeannonce.update({
      where: { idtypeannonce: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.typeannonce.delete({
      where: { idtypeannonce: id },
    });
  }
}
