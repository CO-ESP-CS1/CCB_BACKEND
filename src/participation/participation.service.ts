import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateParticipationDto } from './dto/create-participation.dto';

@Injectable()
export class ParticipationService {
  constructor(private prisma: PrismaService) {}

  private async checkParticipationControlBadge(idmembre: number): Promise<void> {
    const badge = await this.prisma.badge.findFirst({
      where: { nombadge: 'participationControl' },
    });

    if (!badge) {
      throw new ForbiddenException('Le badge "participationControl" n\'existe pas');
    }

    const hasBadge = await this.prisma.membre_badge.findFirst({
      where: {
        idmembre: idmembre,
        idbadge: badge.idbadge,
      },
    });

    if (!hasBadge) {
      throw new ForbiddenException(
        'Seuls les membres avec le badge "participationControl" peuvent noter les participations',
      );
    }
  }

  /**
   * Crée ou met à jour une participation (upsert).
   * Ne gère pas de champ `note` ici (selon ta DB actuelle).
   */
  async recordParticipation(dto: CreateParticipationDto, controllerId: number) {
    // Vérification du badge
    await this.checkParticipationControlBadge(controllerId);

    // Vérifier que la séance existe
    const seance = await this.prisma.seance.findUnique({
      where: { idseance: dto.idseance },
    });
    if (!seance) {
      throw new NotFoundException('Séance introuvable');
    }

    // Vérifier que le membre existe
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre: dto.idmembre },
    });
    if (!membre) {
      throw new NotFoundException('Membre introuvable');
    }

    // Enregistrer ou mettre à jour la participation
    try {
      return await this.prisma.participe.upsert({
        where: {
          idmembre_idseance: {
            idmembre: dto.idmembre,
            idseance: dto.idseance,
          },
        },
        update: {
          // Si tu veux mettre à jour des colonnes (ex: présence), ajoute ici
        },
        create: {
          idmembre: dto.idmembre,
          idseance: dto.idseance,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'upsert participation:', error);
      throw new BadRequestException('Erreur lors de l\'enregistrement de la participation');
    }
  }

async getParticipationStatsByAssemblee(idassemblee: number) {
  // Vérifier que l'assemblée existe
  const assembleeExists = await this.prisma.assemblee.findUnique({
    where: { idassemblee },
  });
  if (!assembleeExists) {
    throw new NotFoundException(`Assemblée ${idassemblee} introuvable`);
  }

  // Nombre total de membres dans cette assemblée (pour %)
  const totalMembres = await this.prisma.membre.count({
    where: { idassemblee },
  });

  // Participations des 7 derniers jours pour les membres de cette assemblée
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const participations = await this.prisma.participe.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      membre: {
        idassemblee,
      },
    },
    select: { createdAt: true },
  });

  // Grouper par jour
  const countsByDay: Record<string, number> = {};
  participations.forEach((p) => {
    const day = p.createdAt.toISOString().split("T")[0];
    countsByDay[day] = (countsByDay[day] || 0) + 1;
  });

  // Construire les stats jour par jour
  const dailyStats: {
    date: string;
    count: number;
    percentage: number; // participation %
    evolution: number | null;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toISOString().split("T")[0];

    const count = countsByDay[key] || 0;
    const percentage = totalMembres > 0 ? (count / totalMembres) * 100 : 0;

    const prev = dailyStats.length > 0 ? dailyStats[dailyStats.length - 1].count : null;
    let evolution: number | null = null;

    if (prev !== null && prev > 0) {
      evolution = ((count - prev) / prev) * 100;
    } else if (prev !== null && prev === 0 && count > 0) {
      evolution = 100;
    }

    dailyStats.push({ date: key, count, percentage, evolution });
  }

  return {
    idassemblee,
    totalMembres,
    last7days: dailyStats,
  };
}



  async getParticipationStats() {
  // Date il y a 7 jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Récupérer toutes les participations des 7 derniers jours
  const participations = await this.prisma.participe.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const total = participations.length;

  // Grouper par jour (aaaa-mm-jj)
  const countsByDay: Record<string, number> = {};
  participations.forEach((p) => {
    const day = p.createdAt.toISOString().split("T")[0];
    countsByDay[day] = (countsByDay[day] || 0) + 1;
  });

  // Générer les 7 derniers jours avec pourcentage
  const dailyStats: {
    date: string;
    count: number;
    evolution: number | null; // % par rapport à la veille
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const key = day.toISOString().split("T")[0];

    const count = countsByDay[key] || 0;
    const prev = dailyStats.length > 0 ? dailyStats[dailyStats.length - 1].count : null;

    let evolution: number | null = null;
    if (prev !== null && prev > 0) {
      evolution = ((count - prev) / prev) * 100;
    } else if (prev !== null && prev === 0 && count > 0) {
      evolution = 100; // tout nouveau jour avec des participations
    }

    dailyStats.push({ date: key, count, evolution });
  }

  return {
    total,
    last7days: dailyStats,
  };
}

  /**
   * Récupère les participations paginées pour une séance avec infos membre/personne/profil.
   * - limit: nombre d'éléments (take)
   * - offset: nombre d'éléments à sauter (skip)
   */
  async getParticipationsBySeance(
    idseance: number,
    limit = 10,
    offset = 0,
  ): Promise<any[]> {
    // Vérifier que la séance existe
    const seance = await this.prisma.seance.findUnique({
      where: { idseance },
    });
    if (!seance) {
      throw new NotFoundException('Séance introuvable');
    }

    // Récupérer les participations paginées avec jointures
    try {
      const participations = await this.prisma.participe.findMany({
        where: { idseance },
        skip: offset,
        take: limit,
        include: {
          membre: {
            include: {
              personne: {
                include: {
                  // prendre le profil le plus récent (si plusieurs)
                  profilpersonne: {
                    take: 1,
                    orderBy: { createat: 'desc' },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          idmembre: 'asc',
        },
      });

      // Mapper la réponse pour ne renvoyer que les champs nécessaires
      return participations.map((p) => ({
        idmembre: p.idmembre,
        idseance: p.idseance,
        membre: {
          codemembre: p.membre.codemembre,
          solde: p.membre.solde ? p.membre.solde.toString() : null,
          personne: p.membre.personne
            ? {
                nom: p.membre.personne.nom,
                prenom: p.membre.personne.prenom,
                photourl:
                  p.membre.personne.profilpersonne &&
                  p.membre.personne.profilpersonne.length > 0
                    ? p.membre.personne.profilpersonne[0].photourl
                    : null,
              }
            : null,
        },
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des participations:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération des participations');
    }
  }

  /**
   * Retourne le nombre total de participations pour une séance (utile pour la pagination).
   */
  async countParticipationsBySeance(idseance: number): Promise<number> {
    try {
      return await this.prisma.participe.count({
        where: { idseance },
      });
    } catch (error) {
      console.error('Erreur lors du count des participations:', error);
      throw new InternalServerErrorException('Impossible de compter les participations');
    }
  }
}
