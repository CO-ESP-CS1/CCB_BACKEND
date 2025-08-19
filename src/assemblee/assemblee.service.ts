import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssembleeDto } from './dto/create-assemblee.dto';
import { UpdateAssembleeDto } from './dto/update-assemblee.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssembleeService {
  private readonly MAX_TAKE = 100; // Limite maximale d'éléments par page
  private readonly DEFAULT_SKIP = 0;
  private readonly DEFAULT_TAKE = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAssembleeDto) {
    const { idarrondissement, ...rest } = data;
    return this.prisma.assemblee.create({
      data: {
        ...rest,
        arrondissement: { connect: { idarrondissement } },
      } as Prisma.assembleeCreateInput,
      include: this.includeProfil(),
    });
  }

  async findAll(
    skip: number = this.DEFAULT_SKIP,
    take: number = this.DEFAULT_TAKE,
    search?: string,
    sortField: string = 'idassemblee',
    sortOrder: Prisma.SortOrder = 'asc'
  ) {
    // Validation du nombre d'éléments à prendre
    if (take > this.MAX_TAKE) {
      throw new BadRequestException(`Vous ne pouvez pas récupérer plus de ${this.MAX_TAKE} éléments à la fois`);
    }

    // Construction des filtres
    const where: Prisma.assembleeWhereInput = {};
    if (search) {
      where.OR = [
        { nomassemble: { contains: search, mode: 'insensitive' } },
        { zone: { contains: search, mode: 'insensitive' } },
        { adresseassemblee: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Validation du champ de tri
    const validSortFields = ['idassemblee', 'nomassemble', 'createat', 'updateat'];
    if (!validSortFields.includes(sortField)) {
      throw new BadRequestException(`Champ de tri invalide: ${sortField}. Valides: ${validSortFields.join(', ')}`);
    }

    // Construction du tri
    const orderBy = { [sortField]: sortOrder };

    // Exécution des requêtes en parallèle
    const [assemblees, total] = await Promise.all([
      this.prisma.assemblee.findMany({
        skip,
        take,
        where,
        include: this.includeProfil(),
        orderBy,
      }),
      this.prisma.assemblee.count({ where }),
    ]);

    // Calcul des métadonnées de pagination
    const currentPage = Math.floor(skip / take) + 1;
    const totalPages = Math.ceil(total / take) || 1;

    return {
      data: assemblees,
      pagination: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
        currentPage,
        totalPages,
        nextPage: skip + take < total ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
      }
    };
  }

  async findOne(id: number) {
    const assemblee = await this.prisma.assemblee.findUnique({
      where: { idassemblee: id },
      include: this.includeProfil(),
    });
    if (!assemblee) throw new NotFoundException(`Assemblée ${id} introuvable`);
    return assemblee;
  }

  async update(id: number, data: UpdateAssembleeDto) {
    await this.ensureExists(id);
    const { idarrondissement, ...rest } = data;

    return this.prisma.assemblee.update({
      where: { idassemblee: id },
      data: {
        ...rest,
        arrondissement: idarrondissement
          ? { connect: { idarrondissement } }
          : undefined,
      } as Prisma.assembleeUpdateInput,
      include: this.includeProfil(),
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.assemblee.delete({
      where: { idassemblee: id },
      include: this.includeProfil(),
    });
  }

  private async ensureExists(id: number) {
    const assemblee = await this.prisma.assemblee.findUnique({
      where: { idassemblee: id },
    });
    if (!assemblee) throw new NotFoundException(`Assemblée ${id} introuvable`);
  }

  private includeProfil() {
    return {
      arrondissement: true,
      profilassemblee: {
        select: {
          photourl: true,
          couvertureurl: true,
          description: true
        }
      }
    };
  }
}