import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateActiviteAssembleeDto1 } from './dto/create-activite-assemblee.dto';
import { UpdateActiviteAssembleeDto } from './dto/update-activite-assemblee.dto';

@Injectable()
export class ActiviteAssembleeService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateActiviteAssembleeDto1) {
    return this.prisma.activite_assemblee.create({
      data: {
        idactivite: data.idactivite,
        idassemblee: data.idassemblee,
        dateprevue: data.dateprevue ? new Date(data.dateprevue) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.activite_assemblee.findMany({
      include: { activite: true, assemblee: true },
    });
  }

  async findOne(idactivite: number, idassemblee: number) {
    const record = await this.prisma.activite_assemblee.findUnique({
      where: { idactivite_idassemblee: { idactivite, idassemblee } },
      include: { activite: true, assemblee: true },
    });
    if (!record) throw new NotFoundException(`Relation ${idactivite}-${idassemblee} introuvable`);
    return record;
  }

  async update(idactivite: number, idassemblee: number, data: UpdateActiviteAssembleeDto) {
    await this.ensureExists(idactivite, idassemblee);
    return this.prisma.activite_assemblee.update({
      where: { idactivite_idassemblee: { idactivite, idassemblee } },
      data: {
        dateprevue: data.dateprevue ? new Date(data.dateprevue) : undefined,
      },
    });
  }

  async remove(idactivite: number, idassemblee: number) {
    await this.ensureExists(idactivite, idassemblee);
    return this.prisma.activite_assemblee.delete({
      where: { idactivite_idassemblee: { idactivite, idassemblee } },
    });
  }

  private async ensureExists(idactivite: number, idassemblee: number) {
    const found = await this.prisma.activite_assemblee.findUnique({
      where: { idactivite_idassemblee: { idactivite, idassemblee } },
    });
    if (!found) throw new NotFoundException(`Relation ${idactivite}-${idassemblee} introuvable`);
  }
}
