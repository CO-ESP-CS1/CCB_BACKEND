import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaysDto } from './dto/create-pays.dto';
import { UpdatePaysDto } from './dto/update-pays.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaysService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePaysDto) {
    return this.prisma.pays.create({
        data: {
          ...dto,
          createat: new Date(),
          updateat: new Date(),
        } as Prisma.paysCreateInput,
      });
      
  }

  findAll() {
    return this.prisma.pays.findMany();
  }

  findOne(id: number) {
    return this.prisma.pays.findUnique({
      where: { idpays: id },
    });
  }

  update(id: number, dto: UpdatePaysDto) {
    const data: Prisma.paysUncheckedUpdateInput = {
      ...dto,
      updateat: new Date(),
    };
    return this.prisma.pays.update({
      where: { idpays: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pays.delete({
      where: { idpays: id },
    });
  }
}
