// src/publication-action/publication-action.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePublicationActionDto } from './dto/create-publication-action.dto';
import { UpdatePublicationActionDto } from './dto/update-publication-action.dto';

@Injectable()
export class PublicationActionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePublicationActionDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.publication_actionUncheckedCreateInput;

    return this.prisma.publication_action.create({ data });
  }

  async findAll() {
    return this.prisma.publication_action.findMany();
  }

  async findOne(id: number) {
    return this.prisma.publication_action.findUnique({
      where: { idpublicationaction: id },
    });
  }

  async update(id: number, dto: UpdatePublicationActionDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.publication_actionUncheckedUpdateInput;

    return this.prisma.publication_action.update({
      where: { idpublicationaction: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.publication_action.delete({
      where: { idpublicationaction: id },
    });
  }
}
