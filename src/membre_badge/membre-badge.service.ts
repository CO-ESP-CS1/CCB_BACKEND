import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMembreBadgeDto } from './dto/create-membre-badge.dto';
import { UpdateMembreBadgeDto } from './dto/update-membre-badge.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembreBadgeService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMembreBadgeDto) {
    return this.prisma.membre_badge.create({
      data: dto as Prisma.membre_badgeUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.membre_badge.findMany();
  }

  findOne(idmembre: number, idbadge: number) {
    return this.prisma.membre_badge.findUnique({
      where: {
        idmembre_idbadge: { idmembre, idbadge },
      },
    });
  }

  update(idmembre: number, idbadge: number, dto: UpdateMembreBadgeDto) {
    return this.prisma.membre_badge.update({
      where: {
        idmembre_idbadge: { idmembre, idbadge },
      },
      data: {
        ...dto,
      },
    });
  }

  remove(idmembre: number, idbadge: number) {
    return this.prisma.membre_badge.delete({
      where: {
        idmembre_idbadge: { idmembre, idbadge },
      },
    });
  }
}
