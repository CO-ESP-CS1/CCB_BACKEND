import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDirigeDto } from './dto/create-dirige.dto';
import { UpdateDirigeDto } from './dto/update-dirige.dto';

@Injectable()
export class DirigeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDirigeDto) {
    return this.prisma.dirige.create({ data: dto });
  }

  async findAll() {
    return this.prisma.dirige.findMany({
      include: { membre: true, departement: true },
    });
  }

  async findOne(idmembre: number, iddepartement: number) {
    const dirige = await this.prisma.dirige.findUnique({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      include: { membre: true, departement: true },
    });
    if (!dirige) throw new NotFoundException('Dirige not found');
    return dirige;
  }

  async update(idmembre: number, iddepartement: number, dto: UpdateDirigeDto) {
    return this.prisma.dirige.update({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
      data: dto,
    });
  }

  async remove(idmembre: number, iddepartement: number) {
    return this.prisma.dirige.delete({
      where: { idmembre_iddepartement: { idmembre, iddepartement } },
    });
  }
}
