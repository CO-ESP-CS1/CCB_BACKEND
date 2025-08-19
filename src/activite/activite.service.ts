import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateActiviteDto1 } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class ActiviteService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateActiviteDto1) {
    const { idtypeactivites, ...rest } = data;
  
    return this.prisma.activite.create({
        data: {
          ...rest,
          datedebut: data.datedebut ? new Date(data.datedebut) : undefined,
          datefin: data.datefin ? new Date(data.datefin) : undefined,
          typeactivites: { connect: { idtypeactivites } },
        } as Prisma.activiteCreateInput, 
      });
      
  }
  

  findAll() {
    return this.prisma.activite.findMany({
      include: { typeactivites: true },
    });
  }

  findOne(id: number) {
    return this.prisma.activite.findUnique({
      where: { idactivite: id },
      include: { typeactivites: true },
    });
  }

  async update(id: number, data: UpdateActiviteDto) {
    await this.ensureExists(id);
  
    const { idtypeactivites, ...rest } = data; // Enlève idtypeactivites du spread
  
    return this.prisma.activite.update({
      where: { idactivite: id },
      data: {
        ...rest,
        datedebut: data.datedebut ? new Date(data.datedebut) : undefined,
        datefin: data.datefin ? new Date(data.datefin) : undefined,
        typeactivites: idtypeactivites
          ? { connect: { idtypeactivites } }
          : undefined,
      },
    });
  }
  

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.activite.delete({
      where: { idactivite: id },
    });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.activite.findUnique({ where: { idactivite: id } });
    if (!found) throw new NotFoundException(`Activité ${id} introuvable`);
  }
}
