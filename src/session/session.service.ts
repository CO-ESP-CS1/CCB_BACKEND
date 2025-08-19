import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async checkSessionExists(deviceid: string, telephone: string): Promise<boolean> {
    const session = await this.prisma.session.findFirst({
      where: {
        deviceid,
        telephone,
        // Option : ajouter une vérification de statut
        // statutsession: 'actif'
      }
    });
    return !!session;
  }

  async create(dto: CreateSessionDto) {
    const data = {
      ...dto,
      createat: new Date(),
      updateat: new Date(),
    };

    return this.prisma.session.create({ data });
  }

  async findAll() {
    return this.prisma.session.findMany();
  }

  async findOne(id: number) {
    return this.prisma.session.findUnique({
      where: { idsession: id },
    });
  }

  async update(id: number, dto: UpdateSessionDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    };

    return this.prisma.session.update({
      where: { idsession: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.session.delete({
      where: { idsession: id },
    });
  }
}