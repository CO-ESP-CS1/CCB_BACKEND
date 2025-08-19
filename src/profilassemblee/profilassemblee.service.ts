// src/profilassemblee/profilassemblee.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProfilassembleeDto } from './dto/create-profilassemblee.dto';
import { UpdateProfilassembleeDto } from './dto/update-profilassemblee.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfilassembleeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfilassembleeDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.profilassembleeUncheckedCreateInput;

    return this.prisma.profilassemblee.create({ data });
  }

  async findAll() {
    return this.prisma.profilassemblee.findMany();
  }

  async findOne(id: number) {
    return this.prisma.profilassemblee.findUnique({
      where: { idprofilassemblee: id },
    });
  }

  async update(id: number, dto: UpdateProfilassembleeDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.profilassembleeUncheckedUpdateInput;

    return this.prisma.profilassemblee.update({
      where: { idprofilassemblee: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.profilassemblee.delete({
      where: { idprofilassemblee: id },
    });
  }
}
