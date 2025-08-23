import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateArrondissementDto } from './dto/create-arrondissement.dto';
import { UpdateArrondissementDto } from './dto/update-arrondissement.dto';

@Injectable()
export class ArrondissementService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateArrondissementDto) {
    return this.prisma.arrondissement.create({
      data: {
        nomarrondissement: data.nomarrondissement,
        ville: { connect: { idville: data.idville } },
      } as Prisma.arrondissementCreateInput,
    });
  }

  async findAll(limit = 10, offset = 0) {
    const [data, total] = await Promise.all([
      this.prisma.arrondissement.findMany({
        include: { ville: true },
        take: limit,      // nombre d’éléments à récupérer
        skip: offset,     // décalage pour pagination
      }),
      this.prisma.arrondissement.count(), // total pour le frontend
    ]);

    return { data, total, limit, offset };
  }

  async findOne(id: number) {
    return this.prisma.arrondissement.findUnique({
      where: { idarrondissement: id },
      include: { ville: true },
    });
  }

  async update(id: number, data: UpdateArrondissementDto) {
    await this.ensureExists(id);

    const { idville, ...rest } = data;

    return this.prisma.arrondissement.update({
      where: { idarrondissement: id },
      data: {
        ...rest,
        ville: idville ? { connect: { idville } } : undefined,
      } as Prisma.arrondissementUpdateInput,
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.arrondissement.delete({ where: { idarrondissement: id } });
  }

  private async ensureExists(id: number) {
    const found = await this.prisma.arrondissement.findUnique({ where: { idarrondissement: id } });
    if (!found) throw new NotFoundException(`Arrondissement ${id} introuvable`);
  }
}
