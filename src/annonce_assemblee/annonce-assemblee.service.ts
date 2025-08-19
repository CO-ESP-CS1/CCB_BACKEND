import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAnnonceAssembleeDto } from './dto/create-annonce-assemblee.dto';
import { UpdateAnnonceAssembleeDto } from './dto/update-annonce-assemblee.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnnonceAssembleeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAnnonceAssembleeDto) {
    return this.prisma.annonce_assemblee.create({
      data: {
     
        annonce: { connect: { idannonce: data.idannonce } },
        assemblee: { connect: { idassemblee: data.idassemblee } },
      } as Prisma.annonce_assembleeCreateInput,
    });
  }
  

  findAll() {
    return this.prisma.annonce_assemblee.findMany({
      include: { annonce: true, assemblee: true },
    });
  }

  async findOne(idannonce: number, idassemblee: number) {
    const record = await this.prisma.annonce_assemblee.findUnique({
      where: { idannonce_idassemblee: { idannonce, idassemblee } },
      include: { annonce: true, assemblee: true },
    });

    if (!record) throw new NotFoundException(`Lien annonce-assemblée non trouvé`);
    return record;
  }

  async update(idannonce: number, idassemblee: number, data: UpdateAnnonceAssembleeDto) {
    await this.ensureExists(idannonce, idassemblee);

    return this.prisma.annonce_assemblee.update({
      where: { idannonce_idassemblee: { idannonce, idassemblee } },
      data: {
       
      },
    });
  }

  async remove(idannonce: number, idassemblee: number) {
    await this.ensureExists(idannonce, idassemblee);

    return this.prisma.annonce_assemblee.delete({
      where: { idannonce_idassemblee: { idannonce, idassemblee } },
    });
  }

  private async ensureExists(idannonce: number, idassemblee: number) {
    const found = await this.prisma.annonce_assemblee.findUnique({
      where: { idannonce_idassemblee: { idannonce, idassemblee } },
    });

    if (!found) throw new NotFoundException(`Lien annonce-assemblée introuvable`);
  }
}
