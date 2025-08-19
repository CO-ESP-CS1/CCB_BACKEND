import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParticipeDto } from './dto/create-participe.dto';
import { UpdateParticipeDto } from './dto/update-participe.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ParticipeService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateParticipeDto) {
    return this.prisma.participe.create({
      data: dto as Prisma.participeUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.participe.findMany();
  }

  findOne(idmembre: number, idseance: number) {
    return this.prisma.participe.findUnique({
      where: {
        idmembre_idseance: { idmembre, idseance },
      },
    });
  }

  update(idmembre: number, idseance: number, dto: UpdateParticipeDto) {
    return this.prisma.participe.update({
      where: {
        idmembre_idseance: { idmembre, idseance },
      },
      data: dto,
    });
  }

  remove(idmembre: number, idseance: number) {
    return this.prisma.participe.delete({
      where: {
        idmembre_idseance: { idmembre, idseance },
      },
    });
  }
}
