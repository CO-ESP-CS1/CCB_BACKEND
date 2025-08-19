import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIntervenantDto } from './dto/create-intervenant.dto';
import { UpdateIntervenantDto } from './dto/update-intervenant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntervenantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIntervenantDto) {
    return this.prisma.intervenant.create({
      data: dto as Prisma.intervenantUncheckedCreateInput,
    });
  }

  async findAll(limit?: number | null, offset: number = 0, search?: string | null) {
    const where: Prisma.intervenantWhereInput = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { nomintervenant: { contains: search, mode: 'insensitive' } },
        { prenomintervenant: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.intervenant.count({ where });

    const data = await this.prisma.intervenant.findMany({
      where,
      orderBy: { createat: 'desc' },
      skip: offset ?? 0,
      take: typeof limit === 'number' && limit > 0 ? limit : undefined,
    });

    return {
      data,
      pagination: {
        total,
        limit: typeof limit === 'number' ? limit : null,
        offset: offset ?? 0,
        search: search ?? null,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.intervenant.findUnique({ where: { idintervenant: id } });
    if (!item) throw new NotFoundException('Intervenant non trouvé');
    return item;
  }

  async update(id: number, dto: UpdateIntervenantDto) {
    await this.findOne(id);
    return this.prisma.intervenant.update({
      where: { idintervenant: id },
      data: { ...dto, updateat: new Date() },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.intervenant.delete({ where: { idintervenant: id } });
  }
}
