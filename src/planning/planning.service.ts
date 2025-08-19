import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlanningService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlanningDto) {
    const { datedebut, datefin, ...rest } = dto;
  
    const data = {
      ...rest,
      datedebut: datedebut ? new Date(datedebut) : null,
      datefin: datefin ? new Date(datefin) : null,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.planningUncheckedCreateInput;
  
    return this.prisma.planning.create({ data });
  }
  
  findAll() {
    return this.prisma.planning.findMany();
  }

  findOne(id: number) {
    return this.prisma.planning.findUnique({ where: { idplanning: id } });
  }

  async update(id: number, dto: UpdatePlanningDto) {
    const data: Prisma.planningUncheckedUpdateInput = {
      ...dto,
      updateat: new Date(),
    };
    return this.prisma.planning.update({
      where: { idplanning: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.planning.delete({ where: { idplanning: id } });
  }
}
