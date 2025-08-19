import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InteractionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInteractionDto) {
    return this.prisma.interaction.create({
      data: dto as Prisma.interactionUncheckedCreateInput,
    });
  }

  async findAll() {
    return this.prisma.interaction.findMany();
  }

  async findOne(id: number) {
    const interaction = await this.prisma.interaction.findUnique({ where: { idinteraction: id } });
    if (!interaction) throw new NotFoundException('Interaction non trouvée');
    return interaction;
  }

  async update(id: number, dto: UpdateInteractionDto) {
    await this.findOne(id);
    return this.prisma.interaction.update({
      where: { idinteraction: id },
      data: { ...dto, updateat: new Date() },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.interaction.delete({ where: { idinteraction: id } });
  }
}
