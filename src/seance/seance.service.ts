import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSeanceDto } from './dto/create-seance.dto';
import { UpdateSeanceDto } from './dto/update-seance.dto';

@Injectable()
export class SeanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSeanceDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.seanceUncheckedCreateInput;

    return this.prisma.seance.create({ data });
  }

async findAll(
  page: number = 1,
  limit: number = 10,
  dateFilter?: Date,
  planningId?: number,
  sortBy?: 'idactivite' | 'idintervenant' | 'date',
  idactivite?: number
) {
  const skip = (page - 1) * limit;
  const where: Prisma.seanceWhereInput = {};

  // Filtrage par date si fourni
  if (dateFilter) {
    const start = new Date(dateFilter);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateFilter);
    end.setHours(23, 59, 59, 999);

    where.OR = [
      { heuredebut: { gte: start, lt: end } },
      { heurefin: { gte: start, lt: end } }
    ];
  }

  // Filtrage par planning
  if (planningId) {
    where.idplanning = planningId;
  }

  // Filtrage par activité
  if (idactivite) {
    where.idactivite = idactivite;
  }

  // Tri toujours par création, décroissant
  const orderBy: Prisma.seanceOrderByWithRelationInput = { createat: 'desc' };

  const [seances, total] = await Promise.all([
    this.prisma.seance.findMany({
      skip,
      take: limit,
      where,
      orderBy,
    }),
    this.prisma.seance.count({ where }),
  ]);

  return {
    data: seances,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: number) {
    return this.prisma.seance.findUnique({
      where: { idseance: id },
    });
  }

  async update(id: number, dto: UpdateSeanceDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.seanceUncheckedUpdateInput;

    return this.prisma.seance.update({
      where: { idseance: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.seance.delete({
      where: { idseance: id },
    });
  }
}