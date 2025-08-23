import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoryDto, PublicationDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private timeToSeconds(value?: string | Date | null): number | null {
    if (!value) return null;
    if (value instanceof Date) {
      return (
        value.getHours() * 3600 +
        value.getMinutes() * 60 +
        value.getSeconds()
      );
    }
    const parts = value.split(':').map((p) => parseInt(p, 10));
    if (parts.length >= 2) {
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const s = parts[2] || 0;
      return h * 3600 + m * 60 + s;
    }
    return null;
  }

  private nowSeconds(): number {
    const d = new Date();
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
  }

  async hasLiveEnCours(): Promise<boolean> {
  const lives = await this.prisma.live.findMany({
    select: { heuredebut: true, heurefin: true },
  });

  const now = new Date();

  return lives.some((l) => {
    const start = l.heuredebut;
    const end = l.heurefin;
    if (!start || !end) return false;

    return now >= start && now <= end;
  });
}


async hasUnreadTargetedAnnouncement(
  memberId: number,
  memberAssembleeId: number,
): Promise<boolean> {
  // Récupère le rôle du membre
  const membre = await this.prisma.membre.findUnique({
    where: { idmembre: memberId },
    select: { role: true },
  });
  if (!membre) return false;
  const memberRole = membre.role;

  // Récupère les départements du membre
  const ests = await this.prisma.est.findMany({
    where: { idmembre: memberId },
    select: { iddepartement: true },
  });
  const memberDepartementIds = ests.map(e => e.iddepartement);

  // Recherche la plus récente annonce non lue, publiée, correspondant aux critères
  const annonce = await this.prisma.annonce.findFirst({
    where: {
      statutannonce: 'publie', // 🔹 seulement les annonces publiées
      NOT: { consultation_annonce: { some: { idmembre: memberId } } },
      annonce_assemblee: { some: { idassemblee: memberAssembleeId } },
      OR: [
        { publique_cible: memberRole },
        { publique_cible: 'TOUS' },
        {
          annonce_departement: {
            some: { iddepartement: { in: memberDepartementIds } },
          },
        },
      ],
    },
    orderBy: { datepublication: 'desc' },
  });

  return !!annonce;
}



  async getStories(limit: number, offset: number): Promise<StoryDto[]> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stories = await this.prisma.publication.findMany({
    where: {
      typepublication: 'STORY',
      statutpublication: 'publie',
      createat: { gte: twentyFourHoursAgo },
    },
    include: {
      membre: {
        include: {
          personne: {
            include: {
              profilpersonne: {
                select: { photourl: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createat: 'desc' },
    take: limit,
    skip: offset,
  });

  return stories.map((p) => ({
    idpublication: p.idpublication,
    titre: p.titre,
    description: p.description,
    mediaurl: p.mediaurl,
    expirationdate: p.expirationdate?.toISOString() ?? null,
    idmembre: p.idmembre,
    membre: {
      idmembre: p.membre.idmembre,
      role: p.membre.role,
      personne: {
        ...p.membre.personne,
        photourl: p.membre.personne.profilpersonne[0]?.photourl ?? null
      }
    },
  }));
}

async getPosts(limit: number, offset: number): Promise<PublicationDto[]> {
  const posts = await this.prisma.publication.findMany({
    where: {
      typepublication: { in: ['POST', 'AUDIO', 'TEXT'] },  // Inclure les types POST et AUDIO
      statutpublication: 'publie'  // Ajouter cette condition pour ne prendre que celles avec statut "publie"
    },
    include: {
      membre: {
        include: {
          personne: {
            include: {
              profilpersonne: {
                select: { photourl: true }
              }
            }
          }
        }
      }
    },
    orderBy: { createat: 'desc' },  // Trier par la date de création (descendant)
    take: limit,  // Limiter le nombre de publications
    skip: offset,  // Pour la pagination
  });

  return posts.map((p) => ({
    idpublication: p.idpublication,
    titre: p.titre,
    description: p.description,
    mediaurl: p.mediaurl,
    mediaurl2: p.mediaurl2,
    mediaurl3: p.mediaurl3,
    typepublication: p.typepublication,
    esttemporaire: p.esttemporaire,
    createat: p.createat?.toISOString(),
    idmembre: p.idmembre,
    membre: {
      idmembre: p.membre.idmembre,
      role: p.membre.role,
      personne: {
        ...p.membre.personne,
        photourl: p.membre.personne.profilpersonne[0]?.photourl ?? null
      }
    },
  }));
}


}
