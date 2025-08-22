import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCotisationDto } from './dto/create-cotisation.dto';
import { UpdateCotisationDto } from './dto/update-cotisation.dto';

@Injectable()
export class CotisationService {
  constructor(private prisma: PrismaService) {}

  async create(createCotisationDto: CreateCotisationDto) {
    return this.prisma.cotisation.create({
      data: {
        ...createCotisationDto,
        createat: new Date(),
        updateat: new Date(),
      },
    });
  }

  async findAll() {
    return this.prisma.cotisation.findMany({
      include: {
        assemblee: {
          select: {
            nomassemble: true,
          },
        },
      },
    });
  }

  async findByAssembleePaginated(idassemblee: number, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [cotisations, total] = await Promise.all([
    this.prisma.cotisation.findMany({
      where: { idassemblee },
      include: {
        assemblee: {
          select: { nomassemble: true },
        },
      },
      orderBy: { date_debut: 'asc' },
      skip,
      take: limit,
    }),
    this.prisma.cotisation.count({ where: { idassemblee } }),
  ]);

  return {
    data: cotisations,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
    },
  };
}


  async findOne(id: number) {
    const cotisation = await this.prisma.cotisation.findUnique({
      where: { id },
      include: {
        assemblee: {
          select: {
            nomassemble: true,
          },
        },
      },
    });

    if (!cotisation) {
      throw new NotFoundException(`Cotisation with ID ${id} not found`);
    }

    return cotisation;
  }

  async update(id: number, updateCotisationDto: UpdateCotisationDto) {
    try {
      return await this.prisma.cotisation.update({
        where: { id },
        data: {
          ...updateCotisationDto,
          updateat: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cotisation with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.cotisation.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cotisation with ID ${id} not found`);
      }
      throw error;
    }
  }
}