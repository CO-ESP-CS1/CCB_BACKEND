import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLiveDto1 } from './dto/create-live.dto';
import { UpdateLiveDto } from './dto/update-live.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LiveService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLiveDto1) {
    return this.prisma.live.create({
      data: dto as Prisma.liveUncheckedCreateInput,
    });
  }

  async findAll() {
    return this.prisma.live.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.live.findUnique({ where: { idlive: id } });
    if (!item) throw new NotFoundException('Live non trouvé');
    return item;
  }

  async update(id: number, dto: UpdateLiveDto) {
    await this.findOne(id);
    return this.prisma.live.update({
      where: { idlive: id },
      data: { ...dto, updateat: new Date() },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.live.delete({ where: { idlive: id } });
  }
}
