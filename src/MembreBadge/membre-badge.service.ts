import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssignBadgeDto } from './dto/assign-role.dto';
import { AssignBadgeByIdDto } from './dto/assign-badge-id.dto';

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  async assignBadgeByRole(dto: AssignBadgeDto) {
    // Vérifier que le membre existe
    const member = await this.prisma.membre.findUnique({
      where: { idmembre: dto.idmembre }
    });

    if (!member) {
      throw new NotFoundException(`Membre avec ID ${dto.idmembre} introuvable`);
    }

    // Trouver le badge correspondant au nom du rôle
    const badge = await this.prisma.badge.findFirst({
      where: { nombadge: dto.roleName }
    });

    if (!badge) {
      throw new NotFoundException(`Aucun badge trouvé pour le rôle '${dto.roleName}'`);
    }

    // Vérifier si le membre possède déjà ce badge
    const existingAssignment = await this.prisma.membre_badge.findUnique({
      where: {
        idmembre_idbadge: {
          idmembre: dto.idmembre,
          idbadge: badge.idbadge
        }
      }
    });

    if (existingAssignment) {
      throw new ConflictException(`Le membre possède déjà le badge '${dto.roleName}'`);
    }

    // Créer l'association dans la table pivot
    return this.prisma.membre_badge.create({
      data: {
        idmembre: dto.idmembre,
        idbadge: badge.idbadge
      },
      include: {
        badge: true,
        membre: {
          include: {
            personne: true
          }
        }
      }
    });
  }


   // Nouvelle méthode pour attribution par ID
  async assignBadgeById(dto: AssignBadgeByIdDto) {
    // Vérifier que le membre existe
    const member = await this.prisma.membre.findUnique({
      where: { idmembre: dto.idmembre }
    });

    if (!member) {
      throw new NotFoundException(`Membre avec ID ${dto.idmembre} introuvable`);
    }

    // Vérifier que le badge existe
    const badge = await this.prisma.badge.findUnique({
      where: { idbadge: dto.idbadge }
    });

    if (!badge) {
      throw new NotFoundException(`Badge avec ID ${dto.idbadge} introuvable`);
    }

    // Vérifier si l'association existe déjà
    const existingAssignment = await this.prisma.membre_badge.findUnique({
      where: {
        idmembre_idbadge: {
          idmembre: dto.idmembre,
          idbadge: dto.idbadge
        }
      }
    });

    if (existingAssignment) {
      throw new ConflictException(`Ce membre possède déjà ce badge (ID: ${badge.idbadge})`);
    }

    // Créer l'association dans la table pivot
    return this.prisma.membre_badge.create({
      data: {
        idmembre: dto.idmembre,
        idbadge: dto.idbadge
      },
      include: {
        badge: true,
        membre: {
          include: {
            personne: true
          }
        }
      }
    });
  }



    async getBadgesByMembreId(idmembre: number, limit?: number | null, offset: number = 0) {
    // Vérifier que le membre existe
    const member = await this.prisma.membre.findUnique({
      where: { idmembre },
      select: { idmembre: true }, // suffit pour vérifier existence
    });

    if (!member) {
      throw new NotFoundException(`Membre avec ID ${idmembre} introuvable`);
    }

    // Total d'associations pour la pagination
    const total = await this.prisma.membre_badge.count({
      where: { idmembre }
    });

    // Récupérer les associations avec pagination
    const assignments = await this.prisma.membre_badge.findMany({
      where: { idmembre },
      include: { badge: true },
      orderBy: { dateattribution: 'desc' },
      skip: offset ?? 0,
      take: typeof limit === 'number' && limit > 0 ? limit : undefined,
    });

    const data = assignments.map(a => ({
      ...a.badge,
      dateattribution: a.dateattribution,
    }));

    return {
      data,
      pagination: {
        total,
        limit: typeof limit === 'number' ? limit : null,
        offset: offset ?? 0,
      },
    };
  }


  async removeBadgeFromMembre(codemembre: string, nombadge: string) {
  // Vérifier que le membre existe
  const membre = await this.prisma.membre.findUnique({
    where: { codemembre },
  });

  if (!membre) {
    throw new NotFoundException(`Membre avec code matricule '${codemembre}' introuvable`);
  }

  // Vérifier que le badge existe
  const badge = await this.prisma.badge.findFirst({
    where: { nombadge },
  });

  if (!badge) {
    throw new NotFoundException(`Badge '${nombadge}' introuvable`);
  }

  // Vérifier si l'association existe
  const assignment = await this.prisma.membre_badge.findUnique({
    where: {
      idmembre_idbadge: {
        idmembre: membre.idmembre,
        idbadge: badge.idbadge,
      },
    },
  });

  if (!assignment) {
    throw new NotFoundException(
      `Le membre '${codemembre}' ne possède pas le badge '${nombadge}'`
    );
  }

  // Supprimer la liaison
  return this.prisma.membre_badge.delete({
    where: {
      idmembre_idbadge: {
        idmembre: membre.idmembre,
        idbadge: badge.idbadge,
      },
    },
  });
}


  
}