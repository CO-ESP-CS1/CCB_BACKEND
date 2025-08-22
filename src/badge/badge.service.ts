import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBadgeDto) {
    return this.prisma.badge.create({
      data: data as Prisma.badgeCreateInput,
    });
  }

  // badge.service.ts
async findAll(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.badge.findMany({
      skip,
      take: limit,
      orderBy: { createat: 'desc' }, // optionnel, pour avoir les plus récents
    }),
    this.prisma.badge.count(),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: number) {
    const badge = await this.prisma.badge.findUnique({
      where: { idbadge: id },
    });

    if (!badge) {
      throw new NotFoundException(`Badge avec l'ID ${id} introuvable`);
    }

    return badge;
  }

  async update(id: number, data: UpdateBadgeDto) {
    await this.findOne(id);

    return this.prisma.badge.update({
      where: { idbadge: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.badge.delete({
      where: { idbadge: id },
    });
  }
}
