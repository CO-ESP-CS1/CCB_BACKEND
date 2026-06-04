import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StoryDto, PublicationDto } from './dto/dashboard.dto';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  HOME_CAROUSEL_MAX_SLIDES,
  HomeCarouselFileDto,
  HomeCarouselResponseDto,
  HomeCarouselSlideDto,
} from './home-carousel';
import {
  ADMIN_NOTIFICATIONS_MAX,
  AdminNotificationDto,
  AdminNotificationsFileDto,
  AdminNotificationsResponseDto,
} from './admin-notifications';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateHomeCarouselDto } from './dto/update-home-carousel.dto';
import { UpdateAdminNotificationsDto } from './dto/update-admin-notifications.dto';
import {
  AssemblyFeedItemDto,
  AssemblyFeedResponseDto,
  UpcomingLiveDto,
} from './assembly-feed';
import {
  statut_annonce_enum,
  statut_publication_enum,
  type_publication_enum,
} from '@prisma/client';
import {
  CellGroupDto,
  EngagementBadgeDto,
  EngagementInsightsDto,
  WeekSeanceDto,
} from './engagement-phase3';

const CAROUSEL_MANAGER_BADGES = ['gestionnaire', 'adminBadge', 'ManagerApp'];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

async getMemberPublicPublications(
  idmembre: number,
  limit: number,
  offset: number,
) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const now = new Date();

  return this.prisma.publication.findMany({
    where: {
      idmembre,
      statutpublication: 'publie',
      OR: [
        { typepublication: { in: ['POST', 'AUDIO', 'TEXT'] } },
        {
          typepublication: 'STORY',
          OR: [
            { createat: { gte: twentyFourHoursAgo } },
            { expirationdate: { gt: now } },
          ],
        },
      ],
    },
    orderBy: { createat: 'desc' },
    take: limit,
    skip: offset,
    select: {
      idpublication: true,
      titre: true,
      description: true,
      mediaurl: true,
      mediaurl2: true,
      mediaurl3: true,
      expirationdate: true,
      statutpublication: true,
      typepublication: true,
      esttemporaire: true,
      createat: true,
      updateat: true,
      idmembre: true,
    },
  });
}

  private getCarouselFilePath(): string {
    return (
      process.env.HOME_CAROUSEL_JSON_PATH ||
      path.join(process.cwd(), 'data', 'home-carousel.json')
    );
  }

  private normalizeCarouselSlides(raw: HomeCarouselSlideDto[]): HomeCarouselSlideDto[] {
    return raw
      .filter((s) => s && s.active !== false && s.id && s.title && s.slideName)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, HOME_CAROUSEL_MAX_SLIDES)
      .map((s) => ({
        id: String(s.id),
        title: String(s.title).trim(),
        subtitle: s.subtitle ? String(s.subtitle).trim() : '',
        slideName: String(s.slideName).trim(),
        detailDescription: s.detailDescription
          ? String(s.detailDescription).trim()
          : '',
        imageUrl: s.imageUrl ? String(s.imageUrl).trim() : undefined,
        fallbackKey: s.fallbackKey,
        linkRoute: s.linkRoute ? String(s.linkRoute).trim() : undefined,
        linkLabel: s.linkLabel ? String(s.linkLabel).trim() : undefined,
        active: true,
        order: s.order,
      }));
  }

  async assertCanManageCommunityContent(memberId: number): Promise<void> {
    for (const badgeName of CAROUSEL_MANAGER_BADGES) {
      const badge = await this.prisma.badge.findFirst({
        where: { nombadge: badgeName },
      });
      if (!badge) continue;
      const link = await this.prisma.membre_badge.findUnique({
        where: {
          idmembre_idbadge: { idmembre: memberId, idbadge: badge.idbadge },
        },
      });
      if (link) return;
    }
    throw new ForbiddenException(
      'Accès réservé aux gestionnaires de la communauté.',
    );
  }

  /** @deprecated alias — utiliser assertCanManageCommunityContent */
  async assertCanManageHomeCarousel(memberId: number): Promise<void> {
    return this.assertCanManageCommunityContent(memberId);
  }

  async uploadHomeCarouselImage(
    memberId: number,
    file: Express.Multer.File,
  ): Promise<{ imageUrl: string }> {
    await this.assertCanManageHomeCarousel(memberId);
    if (!file?.buffer?.length) {
      throw new BadRequestException('Fichier image manquant.');
    }
    const result = await this.cloudinaryService.uploadImage(
      file.buffer,
      'home-carousel',
    );
    return { imageUrl: result.secure_url };
  }

  async saveHomeCarousel(
    memberId: number,
    dto: UpdateHomeCarouselDto,
  ): Promise<HomeCarouselResponseDto> {
    await this.assertCanManageHomeCarousel(memberId);
    const slides = this.normalizeCarouselSlides(dto.slides);
    const payload: HomeCarouselFileDto = {
      updatedAt: new Date().toISOString(),
      slides,
    };
    await fs.writeFile(
      this.getCarouselFilePath(),
      JSON.stringify(payload, null, 2),
      'utf-8',
    );
    return { updatedAt: payload.updatedAt ?? null, slides };
  }

  async getHomeCarousel(): Promise<HomeCarouselResponseDto> {
    const filePath = this.getCarouselFilePath();
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as HomeCarouselFileDto;
      const slides = this.normalizeCarouselSlides(parsed?.slides ?? []);
      return {
        updatedAt: parsed?.updatedAt ?? null,
        slides,
      };
    } catch {
      return { updatedAt: null, slides: [] };
    }
  }

  private getAdminNotificationsFilePath(): string {
    return (
      process.env.ADMIN_NOTIFICATIONS_JSON_PATH ||
      path.join(process.cwd(), 'data', 'admin-notifications.json')
    );
  }

  private normalizeAdminNotifications(
    raw: AdminNotificationDto[],
  ): AdminNotificationDto[] {
    return raw
      .filter((n) => n && n.id && n.title?.trim() && n.body?.trim() && n.scheduledAt)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, ADMIN_NOTIFICATIONS_MAX)
      .map((n) => {
        const scheduled = new Date(n.scheduledAt);
        const scheduledAt = Number.isNaN(scheduled.getTime())
          ? new Date().toISOString()
          : scheduled.toISOString();
        return {
          id: String(n.id),
          title: String(n.title).trim(),
          body: String(n.body).trim(),
          scheduledAt,
          linkRoute: n.linkRoute ? String(n.linkRoute).trim() : undefined,
          active: n.active !== false,
          order: n.order,
        };
      });
  }

  async getAdminNotifications(): Promise<AdminNotificationsResponseDto> {
    const filePath = this.getAdminNotificationsFilePath();
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as AdminNotificationsFileDto;
      const notifications = this.normalizeAdminNotifications(
        parsed?.notifications ?? [],
      );
      return {
        updatedAt: parsed?.updatedAt ?? null,
        notifications,
      };
    } catch {
      return { updatedAt: null, notifications: [] };
    }
  }

  async getAdminNotificationsForDevices(): Promise<AdminNotificationsResponseDto> {
    const data = await this.getAdminNotifications();
    const now = Date.now();
    const maxFuture = now + 60 * 24 * 60 * 60 * 1000;
    return {
      ...data,
      notifications: data.notifications.filter((n) => {
        if (n.active === false) return false;
        const t = new Date(n.scheduledAt).getTime();
        return t > now && t <= maxFuture;
      }),
    };
  }

  async saveAdminNotifications(
    memberId: number,
    dto: UpdateAdminNotificationsDto,
  ): Promise<AdminNotificationsResponseDto> {
    await this.assertCanManageCommunityContent(memberId);
    const notifications = this.normalizeAdminNotifications(dto.notifications);
    const payload: AdminNotificationsFileDto = {
      updatedAt: new Date().toISOString(),
      notifications,
    };
    await fs.writeFile(
      this.getAdminNotificationsFilePath(),
      JSON.stringify(payload, null, 2),
      'utf-8',
    );
    return { updatedAt: payload.updatedAt ?? null, notifications };
  }

  private buildAnnonceTargetWhere(
    memberId: number,
    memberAssembleeId: number,
    memberRole: string,
    memberDepartementIds: number[],
  ) {
    return {
      statutannonce: statut_annonce_enum.publie,
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
      NOT: { consultation_annonce: { some: { idmembre: memberId } } },
    };
  }

  async getUpcomingLives(memberAssembleeId?: number): Promise<UpcomingLiveDto[]> {
    const now = new Date();
    const max = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const lives = await this.prisma.live.findMany({
      where: {
        heuredebut: { gte: now, lte: max },
        ...(memberAssembleeId
          ? { membre: { idassemblee: memberAssembleeId } }
          : {}),
      },
      orderBy: { heuredebut: 'asc' },
      take: 30,
      select: {
        idlive: true,
        titrelive: true,
        descriptionlive: true,
        heuredebut: true,
        heurefin: true,
      },
    });

    return lives
      .filter((l) => l.heuredebut)
      .map((l) => ({
        idlive: l.idlive,
        titrelive: l.titrelive,
        descriptionlive: l.descriptionlive,
        heuredebut: l.heuredebut!.toISOString(),
        heurefin: l.heurefin?.toISOString() ?? null,
      }));
  }

  async getAssemblyFeed(
    memberId: number,
    memberAssembleeId: number,
  ): Promise<AssemblyFeedResponseDto> {
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre: memberId },
      select: { role: true },
    });
    if (!membre) {
      return { assembleeName: null, items: [] };
    }

    const ests = await this.prisma.est.findMany({
      where: { idmembre: memberId },
      select: { iddepartement: true },
    });
    const memberDepartementIds = ests.map((e) => e.iddepartement);
    const annonceWhere = this.buildAnnonceTargetWhere(
      memberId,
      memberAssembleeId,
      membre.role,
      memberDepartementIds,
    );

    const now = new Date();

    const [
      assemblee,
      publications,
      annonces,
      seances,
      upcomingLives,
    ] = await Promise.all([
      this.prisma.assemblee.findUnique({
        where: { idassemblee: memberAssembleeId },
        select: { nomassemble: true },
      }),
      this.prisma.publication.findMany({
        where: {
          statutpublication: statut_publication_enum.publie,
          typepublication: {
            in: [
              type_publication_enum.POST,
              type_publication_enum.VIDEO,
              type_publication_enum.TEXT,
              type_publication_enum.AUDIO,
            ],
          },
          membre: { idassemblee: memberAssembleeId },
        },
        include: {
          membre: {
            include: {
              personne: {
                include: {
                  profilpersonne: { select: { photourl: true } },
                },
              },
            },
          },
        },
        orderBy: { createat: 'desc' },
        take: 12,
      }),
      this.prisma.annonce.findMany({
        where: annonceWhere,
        orderBy: { datepublication: 'desc' },
        take: 5,
        select: {
          idannonce: true,
          titreannonce: true,
          datepublication: true,
          descriptionannonce: true,
        },
      }),
      this.getProchainesSeancesForAssemblee(memberAssembleeId, 5),
      this.getUpcomingLives(memberAssembleeId),
    ]);

    const items: AssemblyFeedItemDto[] = [];

    for (const p of publications) {
      const photo =
        p.membre?.personne?.profilpersonne?.[0]?.photourl ?? undefined;
      const author = p.membre?.personne
        ? `${p.membre.personne.prenom ?? ''} ${p.membre.personne.nom ?? ''}`.trim()
        : '';
      const isVideo = p.typepublication === type_publication_enum.VIDEO;
      items.push({
        id: `pub-${p.idpublication}`,
        type: isVideo ? 'video' : 'publication',
        title: p.titre ?? (isVideo ? 'Vidéo' : 'Publication'),
        subtitle: author || undefined,
        imageUrl: photo,
        date: (p.createat ?? new Date()).toISOString(),
        route: isVideo ? '/(tabs)/Videos' : '/BibleHome',
        meta: { idpublication: p.idpublication },
      });
    }

    for (const a of annonces) {
      items.push({
        id: `ann-${a.idannonce}`,
        type: 'annonce',
        title: a.titreannonce ?? 'Annonce',
        subtitle: a.descriptionannonce?.slice(0, 80) ?? undefined,
        date: (a.datepublication ?? new Date()).toISOString(),
        route: '/annonce',
        meta: { idannonce: a.idannonce },
      });
    }

    for (const s of seances) {
      const label =
        s.activite?.libelleactivite ??
        s.planning?.typeplanning ??
        'Séance';
      items.push({
        id: `sea-${s.idseance}`,
        type: 'seance',
        title: label,
        subtitle: s.heuredebut
          ? new Date(s.heuredebut).toLocaleString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          : undefined,
        imageUrl: s.activite?.imageurl ?? undefined,
        date: (s.heuredebut ?? now).toISOString(),
        route: '/planning',
        meta: { idseance: s.idseance },
      });
    }

    for (const l of upcomingLives) {
      items.push({
        id: `live-${l.idlive}`,
        type: 'live_upcoming',
        title: l.titrelive ?? 'Live programmé',
        subtitle: l.descriptionlive?.slice(0, 80) ?? undefined,
        date: l.heuredebut,
        route: '/live',
        meta: { idlive: l.idlive },
      });
    }

    items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return {
      assembleeName: assemblee?.nomassemble ?? null,
      items: items.slice(0, 20),
    };
  }

  private async getProchainesSeancesForAssemblee(
    idassemblee: number,
    limit: number,
  ) {
    const plannings = await this.prisma.assembleeplanning.findMany({
      where: { idassemblee },
      select: { idplanning: true },
    });
    const planningIds = plannings.map((p) => p.idplanning);
    if (planningIds.length === 0) return [];

    return this.prisma.seance.findMany({
      where: {
        idplanning: { in: planningIds },
        heuredebut: { gte: new Date() },
      },
      include: {
        activite: { select: { libelleactivite: true, imageurl: true } },
        planning: { select: { typeplanning: true } },
      },
      orderBy: { heuredebut: 'asc' },
      take: limit,
    });
  }

  async getEngagementInsights(memberId: number): Promise<EngagementInsightsDto> {
    const [likes, comments, reactions, seancesPresent, inscriptions] =
      await Promise.all([
        this.prisma.interaction.count({
          where: { idmembre: memberId, type: 'like' },
        }),
        this.prisma.interaction.count({
          where: { idmembre: memberId, type: 'commentaire' },
        }),
        this.prisma.interaction.count({
          where: { idmembre: memberId, type: 'reaction' },
        }),
        this.prisma.participe.count({ where: { idmembre: memberId } }),
        this.prisma.inscription.count({ where: { idmembre: memberId } }),
      ]);

    const defs: Omit<EngagementBadgeDto, 'earned' | 'progress'>[] = [
      {
        id: 'encourager',
        title: 'Encourageur',
        description: 'Réactions bienveillantes sur les publications',
        target: 5,
        icon: 'heart',
      },
      {
        id: 'commentateur',
        title: 'Voix active',
        description: 'Commentaires partagés avec la communauté',
        target: 3,
        icon: 'message-circle',
      },
      {
        id: 'present',
        title: 'Présent',
        description: 'Présences confirmées aux activités',
        target: 2,
        icon: 'calendar',
      },
      {
        id: 'inscrit',
        title: 'Engagé',
        description: 'Inscriptions à des activités',
        target: 1,
        icon: 'check-circle',
      },
    ];

    const values: Record<string, number> = {
      encourager: reactions,
      commentateur: comments,
      present: seancesPresent,
      inscrit: inscriptions,
    };

    const badges: EngagementBadgeDto[] = defs.map((d) => {
      const progress = values[d.id] ?? 0;
      return {
        ...d,
        progress,
        earned: progress >= d.target,
      };
    });

    return {
      badges,
      stats: { likes, comments, reactions, seancesPresent, inscriptions },
    };
  }

  async getMemberCellGroups(memberId: number): Promise<CellGroupDto[]> {
    const links = await this.prisma.est.findMany({
      where: { idmembre: memberId },
      include: { departement: { select: { iddepartement: true, nomdepartement: true } } },
    });
    return links
      .filter((l) => l.departement?.nomdepartement)
      .map((l) => ({
        iddepartement: l.iddepartement,
        nomdepartement: l.departement!.nomdepartement!,
      }));
  }

  async getCellGroupFeed(
    iddepartement: number,
    limit = 15,
  ): Promise<AssemblyFeedItemDto[]> {
    const memberIds = await this.prisma.est.findMany({
      where: { iddepartement },
      select: { idmembre: true },
    });
    const ids = memberIds.map((m) => m.idmembre);
    if (ids.length === 0) return [];

    const publications = await this.prisma.publication.findMany({
      where: {
        statutpublication: statut_publication_enum.publie,
        typepublication: {
          in: [
            type_publication_enum.POST,
            type_publication_enum.VIDEO,
            type_publication_enum.TEXT,
          ],
        },
        idmembre: { in: ids },
      },
      include: {
        membre: {
          include: {
            personne: {
              include: { profilpersonne: { select: { photourl: true } } },
            },
          },
        },
      },
      orderBy: { createat: 'desc' },
      take: limit,
    });

    return publications.map((p) => {
      const author = p.membre?.personne
        ? `${p.membre.personne.prenom ?? ''} ${p.membre.personne.nom ?? ''}`.trim()
        : '';
      const isVideo = p.typepublication === type_publication_enum.VIDEO;
      return {
        id: `pub-${p.idpublication}`,
        type: isVideo ? 'video' : 'publication',
        title: p.titre ?? 'Publication',
        subtitle: author || undefined,
        imageUrl: p.membre?.personne?.profilpersonne?.[0]?.photourl ?? undefined,
        date: (p.createat ?? new Date()).toISOString(),
        route: isVideo ? '/(tabs)/Videos' : '/BibleHome',
        meta: { idpublication: p.idpublication },
      };
    });
  }

  async getWeekSeances(
    memberId: number,
    idassemblee: number,
  ): Promise<WeekSeanceDto[]> {
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const seances = await this.getProchainesSeancesForAssemblee(idassemblee, 20);
    const filtered = seances.filter((s) => {
      if (!s.heuredebut) return false;
      const t = new Date(s.heuredebut);
      return t <= end;
    });

    const confirmed = await this.prisma.participe.findMany({
      where: {
        idmembre: memberId,
        idseance: { in: filtered.map((s) => s.idseance) },
      },
      select: { idseance: true },
    });
    const confirmedSet = new Set(confirmed.map((c) => c.idseance));

    return filtered.map((s) => ({
      idseance: s.idseance,
      titreseance: s.titreseance,
      heuredebut: s.heuredebut!.toISOString(),
      heurefin: s.heurefin?.toISOString() ?? null,
      lieu: s.lieu,
      activiteLabel:
        s.activite?.libelleactivite ?? s.planning?.typeplanning ?? null,
      confirmed: confirmedSet.has(s.idseance),
    }));
  }

  async confirmSeancePresence(
    memberId: number,
    idseance: number,
  ): Promise<{ ok: boolean; idseance: number }> {
    const seance = await this.prisma.seance.findUnique({
      where: { idseance },
    });
    if (!seance) {
      throw new BadRequestException('Séance introuvable.');
    }

    await this.prisma.participe.upsert({
      where: {
        idmembre_idseance: { idmembre: memberId, idseance },
      },
      update: {},
      create: { idmembre: memberId, idseance },
    });

    return { ok: true, idseance };
  }
}
