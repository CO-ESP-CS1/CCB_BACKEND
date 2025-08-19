import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVilleDto } from './dto/create-ville.dto';
import { UpdateVilleDto } from './dto/update-ville.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VilleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVilleDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.villeUncheckedCreateInput;
  
    return this.prisma.ville.create({ data });
  }
  

  async findAll() {
    return this.prisma.ville.findMany();
  }

  async findOne(id: number) {
    const ville = await this.prisma.ville.findUnique({
      where: { idville: id },
    });
    if (!ville) {
      throw new NotFoundException(`Ville with id ${id} not found`);
    }
    return ville;
  }

  async update(id: number, dto: UpdateVilleDto) {
    await this.findOne(id); // check existence

    const data: Prisma.villeUncheckedUpdateInput = {
      ...dto,
      updateat: new Date(),
    };

    return this.prisma.ville.update({
      where: { idville: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // check existence

    return this.prisma.ville.delete({
      where: { idville: id },
    });
  }
}
