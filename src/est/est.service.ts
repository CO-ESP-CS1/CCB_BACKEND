import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEstDto } from './dto/create-est.dto';
import { UpdateEstDto } from './dto/update-est.dto';

@Injectable()
export class EstService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEstDto) {
    return this.prisma.est.create({ data: dto });
  }

  async findAll() {
    return this.prisma.est.findMany({
      include: { membre: true, departement: true },
    });
  }

  async findOne(idmembre: number, iddepartement: number) {
    const est = await this.prisma.est.findUnique({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      include: { membre: true, departement: true },
    });
    if (!est) throw new NotFoundException('Est not found');
    return est;
  }

  async update(idmembre: number, iddepartement: number, dto: UpdateEstDto) {
    return this.prisma.est.update({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      data: dto,
    });
  }

  async remove(idmembre: number, iddepartement: number) {
    return this.prisma.est.delete({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
    });
  }
}
