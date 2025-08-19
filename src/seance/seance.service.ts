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
    sortBy?: 'idactivite' | 'idintervenant' | 'date'
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.seanceWhereInput = {};
    
    // Filtrage par date
    if (dateFilter) {
      where.OR = [
        { 
          heuredebut: { 
            gte: new Date(dateFilter.setHours(0, 0, 0, 0)),
            lt: new Date(dateFilter.setHours(23, 59, 59, 999))
          } 
        },
        { 
          heurefin: { 
            gte: new Date(dateFilter.setHours(0, 0, 0, 0)),
            lt: new Date(dateFilter.setHours(23, 59, 59, 999))
          } 
        }
      ];
    }
    
    // Filtrage par planning
    if (planningId) {
      where.idplanning = planningId;
    }
    
    // Tri
    let orderBy: Prisma.seanceOrderByWithRelationInput = {};
    if (sortBy) {
      if (sortBy === 'idactivite') orderBy = { idactivite: 'asc' };
      if (sortBy === 'idintervenant') orderBy = { idintervenant: 'asc' };
      if (sortBy === 'date') orderBy = { heuredebut: 'asc' };
    } else {
      orderBy = { idseance: 'asc' };
    }
    
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