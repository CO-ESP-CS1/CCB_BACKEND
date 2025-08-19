import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PersonneService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePersonneDto) {
    return this.prisma.personne.create({
      data: {
        ...dto,
        datenaissance: dto.datenaissance ? new Date(dto.datenaissance) : undefined,
        createat: new Date(),
        updateat: new Date(),
      } as Prisma.personneUncheckedCreateInput,
    });
  }
  
  

  findAll() {
    return this.prisma.personne.findMany();
  }

  async findOne(id: number) {
    const personne = await this.prisma.personne.findUnique({ where: { idpersonne: id } });
    if (!personne) throw new NotFoundException('Personne not found');
    return personne;
  }

  async update(id: number, dto: UpdatePersonneDto) {
    await this.findOne(id);
    const data: Prisma.personneUpdateInput = {
      ...dto,
      updateat: new Date(),
    };
    return this.prisma.personne.update({
      where: { idpersonne: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.personne.delete({ where: { idpersonne: id } });
  }


  
}
