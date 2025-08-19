import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLoginHistoryDto } from './dto/create-loginhistory.dto';
import { UpdateLoginHistoryDto } from './dto/update-loginhistory.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LoginHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLoginHistoryDto) {
    return this.prisma.loginhistory.create({
      data: dto as Prisma.loginhistoryUncheckedCreateInput,
    });
  }

  async findAll() {
    return this.prisma.loginhistory.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.loginhistory.findUnique({ where: { idloginhistory: id } });
    if (!item) throw new NotFoundException('Login history non trouvé');
    return item;
  }

  async update(id: number, dto: UpdateLoginHistoryDto) {
    await this.findOne(id);
    return this.prisma.loginhistory.update({
      where: { idloginhistory: id },
      data: { ...dto, updateat: new Date() },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.loginhistory.delete({ where: { idloginhistory: id } });
  }
}
