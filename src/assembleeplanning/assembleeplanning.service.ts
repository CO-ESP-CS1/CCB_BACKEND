import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssembleePlanningDto } from './dto/create-assembleeplanning.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssembleePlanningService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly MAX_LIMIT = 100; // limite supérieure pour take

  /**
   * Crée une association assemblee <-> planning.
   * - tente un CREATE atomique ;
   * - si duplication (P2002), récupère l'enregistrement existant et retourne created: false.
   *
   * Retourne { created: boolean, record }.
   */
  async create(data: CreateAssembleePlanningDto) {
    const { idassemblee, idplanning } = data;

    // Validation minimale d'entrée
    if (!Number.isInteger(idassemblee) || !Number.isInteger(idplanning)) {
      throw new BadRequestException('idassemblee et idplanning doivent être des entiers');
    }

    // Vérifier existence des entités liées
    const [assemblee, planning] = await Promise.all([
      this.prisma.assemblee.findUnique({ where: { idassemblee } }),
      this.prisma.planning.findUnique({ where: { idplanning } }),
    ]);

    if (!assemblee) {
      throw new NotFoundException(`Assemblee ${idassemblee} introuvable`);
    }
    if (!planning) {
      throw new NotFoundException(`Planning ${idplanning} introuvable`);
    }

    try {
      const createdRecord = await this.prisma.assembleeplanning.create({
        data: {
          assemblee: { connect: { idassemblee } },
          planning: { connect: { idplanning } },
        } as Prisma.assembleeplanningCreateInput,
        include: { assemblee: true, planning: true },
      });

      return { created: true, record: createdRecord };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Doublon : récupérer l'enregistrement existant et le retourner
        try {
          const existing = await this.prisma.assembleeplanning.findUnique({
            where: { idassemblee_idplanning: { idassemblee, idplanning } },
            include: { assemblee: true, planning: true },
          });

          if (existing) {
            return { created: false, record: existing };
          } else {
            throw new ConflictException('Association déjà existante (doublon détecté) mais introuvable');
          }
        } catch (innerErr) {
          console.error('assembleeplanning.create: erreur en récupérant le doublon', innerErr);
          throw new InternalServerErrorException('Erreur lors de la gestion du conflit');
        }
      }

      console.error('assembleeplanning.create error:', error);
      throw new InternalServerErrorException('Erreur lors de la création de l\'association');
    }
  }

  /**
   * findAll avec pagination et filtre optionnel par assembleeId.
   * Renvoie { data: [...], pagination: { total, page, limit, totalPages } }
   */
async findAll(page = 1, limit = 10, assembleeId?: number) {
  // Validation des paramètres
  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = 10;
  limit = Math.min(limit, this.MAX_LIMIT);

  const skip = (page - 1) * limit;

  // Création du filtre "where" pour la requête
  const where: Prisma.assembleeplanningWhereInput = {};
  if (assembleeId && Number.isInteger(assembleeId)) {
    where.idassemblee = assembleeId;
  }

  try {
    const [items, total] = await Promise.all([
      this.prisma.assembleeplanning.findMany({
        where,
        include: { assemblee: true, planning: true },
        skip,
        take: limit,
        orderBy: [
          { planning: { createat: 'desc' } },  // Tri par la date de création du planning
          { idassemblee: 'asc' },               // Tri secondaire
          { idplanning: 'asc' },                // Tri tertiaire
        ],
      }),
      this.prisma.assembleeplanning.count({ where }),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('assembleeplanning.findAll error:', error);
    throw new InternalServerErrorException('Erreur lors de la récupération des associations');
  }
}


  /**
   * Récupère une association par clé composite.
   */
  async findOne(idassemblee: number, idplanning: number) {
    try {
      const record = await this.prisma.assembleeplanning.findUnique({
        where: { idassemblee_idplanning: { idassemblee, idplanning } },
        include: { assemblee: true, planning: true },
      });

      if (!record) {
        throw new NotFoundException(
          `Association assemblee ${idassemblee} et planning ${idplanning} introuvable`,
        );
      }

      return record;
    } catch (error) {
      console.error('assembleeplanning.findOne error:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération');
    }
  }

  /**
   * Supprime une association (delete). Vérifie d'abord l'existence.
   */
  async remove(idassemblee: number, idplanning: number) {
    try {
      const existing = await this.prisma.assembleeplanning.findUnique({
        where: { idassemblee_idplanning: { idassemblee, idplanning } },
      });

      if (!existing) {
        throw new NotFoundException(
          `Association assemblee ${idassemblee} et planning ${idplanning} introuvable`,
        );
      }

      const deleted = await this.prisma.assembleeplanning.delete({
        where: { idassemblee_idplanning: { idassemblee, idplanning } },
      });

      return deleted;
    } catch (error) {
      console.error('assembleeplanning.remove error:', error);
      throw new InternalServerErrorException('Erreur lors de la suppression');
    }
  }
}
