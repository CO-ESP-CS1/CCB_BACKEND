import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDepartementDto) {
    const { idassemblee, ...rest } = data;

    return this.prisma.departement.create({
      data: {
        ...rest,
        assemblee: idassemblee ? { connect: { idassemblee } } : undefined,
      } as Prisma.departementCreateInput,
    });
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
    idassemblee?: number
  ) {
    const where: Prisma.departementWhereInput = {};
    
    // Filtre par assemblée si fourni
    if (idassemblee) {
      where.idassemblee = idassemblee;
    }

    const [total, departements] = await Promise.all([
      this.prisma.departement.count({ where }),
      this.prisma.departement.findMany({
        where,
        skip: offset,
        take: limit,
        include: {
          assemblee: true,
          profildepartement: true // Inclure le profil du département
        },
        orderBy: {
          nomdepartement: 'asc' // Tri par nom par défaut
        }
      })
    ]);

    return {
      data: departements,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  async findOne(id: number) {
    const departement = await this.prisma.departement.findUnique({
      where: { iddepartement: id },
      include: { 
        assemblee: true,
        profildepartement: true // Inclure le profil
      },
    });

    if (!departement) {
      throw new NotFoundException(`Département avec l'ID ${id} introuvable`);
    }

    return departement;
  }

  async update(id: number, data: UpdateDepartementDto) {
    await this.findOne(id);

    const { idassemblee, ...rest } = data;

    return this.prisma.departement.update({
      where: { iddepartement: id },
      data: {
        ...rest,
        assemblee: idassemblee ? { connect: { idassemblee } } : undefined,
      } as Prisma.departementUpdateInput,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.departement.delete({
      where: { iddepartement: id },
    });
  }
}