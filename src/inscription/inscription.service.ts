import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { UpdateInscriptionDto } from './dto/update-inscription.dto';
import { UpdateInscriptionStatusDto } from './dto/update-inscription-status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInscriptionDto) {
    return this.prisma.inscription.create({
      data: {
        ...dto,
        createat: new Date(),
        updateat: new Date(),
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    idactivite?: number,
    idmembre?: number,
    statut?: string
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.inscriptionWhereInput = {};
    
    if (idactivite) where.idactivite = idactivite;
    if (idmembre) where.idmembre = idmembre;
    if (statut) where.statut = statut as any;

    const [inscriptions, total] = await Promise.all([
      this.prisma.inscription.findMany({
        skip,
        take: limit,
        where,
        include: {
          membre: {
            include: {
              personne: {
                include: {
                  profilpersonne: true
                }
              }
            }
          },
          activite: true
        }
      }),
      this.prisma.inscription.count({ where })
    ]);

    return {
      data: inscriptions.map(insc => {
        // insc exists (findMany never returns null items), but nested relations can be null
        const membre = insc.membre ?? null;
        const personne = membre?.personne ?? null;
        const profil = personne?.profilpersonne?.[0] ?? null;

        return {
          ...insc,
          membre: membre
            ? {
                ...membre,
                personne: personne
                  ? {
                      ...personne,
                      profil
                    }
                  : null
              }
            : null
        };
      }),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(id: number) {
    const insc = await this.prisma.inscription.findUnique({
      where: { idinscription: id },
      include: {
        membre: {
          include: {
            personne: {
              include: {
                profilpersonne: true
              }
            }
          }
        },
        activite: true
      }
    });

    if (!insc) {
      return null; // ou throw new NotFoundException(`Inscription ${id} not found`);
    }

    const membre = insc.membre ?? null;
    const personne = membre?.personne ?? null;
    const profil = personne?.profilpersonne?.[0] ?? null;

    return {
      ...insc,
      membre: membre
        ? {
            ...membre,
            personne: personne
              ? {
                  ...personne,
                  profil
                }
              : null
          }
        : null
    };
  }

  async update(id: number, dto: UpdateInscriptionDto) {
    return this.prisma.inscription.update({
      where: { idinscription: id },
      data: {
        ...dto,
        updateat: new Date(),
      },
    });
  }

  async updateStatus(id: number, dto: UpdateInscriptionStatusDto) {
    return this.prisma.inscription.update({
      where: { idinscription: id },
      data: {
        statut: dto.statut,
        updateat: new Date(),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.inscription.delete({
      where: { idinscription: id },
    });
  }
}
