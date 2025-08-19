import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCodeRecuperationDto } from './dto/create-coderecuperation.dto';
import { UpdateCodeRecuperationDto } from './dto/update-coderecuperation.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CodeRecuperationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCodeRecuperationDto) {
    const { connexionid, ...rest } = data;

    return this.prisma.coderecuperation.create({
      data: {
        ...rest,
        datedebutvalidite: data.datedebutvalidite ? new Date(data.datedebutvalidite) : undefined,
        expirele: data.expirele ? new Date(data.expirele) : undefined,
        connexion: { connect: { connexionid } },
      } as Prisma.coderecuperationCreateInput,
    });
  }

  findAll() {
    return this.prisma.coderecuperation.findMany();
  }

  async findOne(id: number) {
    const code = await this.prisma.coderecuperation.findUnique({
      where: { idcoderecuperation: id },
    });

    if (!code) {
      throw new NotFoundException(`Code de récupération avec l'ID ${id} introuvable`);
    }

    return code;
  }

  async update(id: number, data: UpdateCodeRecuperationDto) {
    await this.findOne(id);

    const { connexionid, ...rest } = data;

    return this.prisma.coderecuperation.update({
      where: { idcoderecuperation: id },
      data: {
        ...rest,
        datedebutvalidite: data.datedebutvalidite ? new Date(data.datedebutvalidite) : undefined,
        expirele: data.expirele ? new Date(data.expirele) : undefined,
        connexion: connexionid ? { connect: { connexionid } } : undefined,
      } as Prisma.coderecuperationUpdateInput,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.coderecuperation.delete({
      where: { idcoderecuperation: id },
    });
  }
}
