import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateMePersonneDto } from './dto/update-me-personne.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: DashboardService,
  ) {}

  private parseIdMembre(user: Record<string, unknown>): number {
    const raw = user?.idmembre;
    if (raw == null) {
      throw new UnauthorizedException('idmembre absent du token');
    }
    const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    if (!id || Number.isNaN(id)) {
      throw new UnauthorizedException('idmembre invalide dans le token');
    }
    return id;
  }

  private parseIdAssemblee(user: Record<string, unknown>): number {
    const raw = user?.idassemblee;
    if (raw == null) {
      throw new UnauthorizedException('idassemblee absent du token');
    }
    const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    if (!id || Number.isNaN(id)) {
      throw new UnauthorizedException('idassemblee invalide dans le token');
    }
    return id;
  }

  private parseIdPersonne(user: Record<string, unknown>): number {
    const raw = user?.sub;
    if (raw == null) {
      throw new UnauthorizedException('idpersonne absent du token');
    }
    const id = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
    if (!id || Number.isNaN(id)) {
      throw new UnauthorizedException('idpersonne invalide dans le token');
    }
    return id;
  }

  async updateMyPersonne(user: Record<string, unknown>, dto: UpdateMePersonneDto) {
    const idpersonne = this.parseIdPersonne(user);

    const data: Prisma.personneUpdateInput = {
      updateat: new Date(),
    };

    if (dto.nom !== undefined) {
      data.nom = dto.nom.trim();
    }
    if (dto.prenom !== undefined) {
      data.prenom = dto.prenom.trim();
    }
    if (dto.sexe !== undefined) {
      data.sexe = dto.sexe;
    }
    if (dto.datenaissance !== undefined) {
      data.datenaissance = new Date(dto.datenaissance);
    }

    const updated = await this.prisma.personne.update({
      where: { idpersonne },
      data,
      select: {
        idpersonne: true,
        nom: true,
        prenom: true,
        sexe: true,
        datenaissance: true,
        email: true,
        telephone: true,
      },
    });

    return {
      message: 'Informations personnelles mises à jour',
      personne: updated,
    };
  }

  async changeMyPassword(user: Record<string, unknown>, dto: ChangePasswordDto) {
    const idpersonne = this.parseIdPersonne(user);
    const telephone = user.telephone as string | undefined;

    if (!telephone) {
      throw new UnauthorizedException('Téléphone absent du token');
    }

    if (dto.ancien_mot_de_passe === dto.nouveau_mot_de_passe) {
      throw new BadRequestException(
        'Le nouveau mot de passe doit être différent de l\'ancien',
      );
    }

    const connexion = await this.prisma.connexion.findFirst({
      where: { idpersonne },
    });

    if (!connexion?.mot_de_passe) {
      throw new NotFoundException('Compte de connexion introuvable');
    }

    const passwordMatch = await bcrypt.compare(
      dto.ancien_mot_de_passe,
      connexion.mot_de_passe,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.nouveau_mot_de_passe, 10);

    await this.prisma.connexion.update({
      where: { connexionid: connexion.connexionid },
      data: {
        mot_de_passe: hashedPassword,
        updateat: new Date(),
      },
    });

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async getDashboard(user: Record<string, unknown>) {
    const idmembre = this.parseIdMembre(user);
    const idassemblee = this.parseIdAssemblee(user);

    const membre = await this.prisma.membre.findUnique({
      where: { idmembre },
      include: {
        personne: { select: { nom: true, prenom: true } },
        assemblee: { select: { idassemblee: true, nomassemble: true } },
      },
    });

    if (!membre) {
      throw new NotFoundException('Membre introuvable');
    }

    const now = new Date();

    const [
      inscriptionsCount,
      badgesCount,
      departementsCount,
      cotisationsActives,
      paiementsCount,
      prochainesSeances,
      hasUnreadAnnouncement,
      hasLiveEnCours,
    ] = await Promise.all([
      this.prisma.inscription.count({ where: { idmembre } }),
      this.prisma.membre_badge.count({ where: { idmembre } }),
      this.prisma.est.count({ where: { idmembre } }),
      this.prisma.cotisation.count({
        where: {
          idassemblee,
          date_debut: { lte: now },
          date_fin: { gte: now },
        },
      }),
      this.prisma.paiement.count({ where: { idmembre } }),
      this.getProchainesSeances(idassemblee, 5),
      this.dashboardService.hasUnreadTargetedAnnouncement(idmembre, idassemblee),
      this.dashboardService.hasLiveEnCours(),
    ]);

    const paiementsValides = await this.prisma.paiement.count({
      where: { idmembre, statut: 'valide' },
    });

    return {
      membre: {
        idmembre: membre.idmembre,
        codemembre: membre.codemembre,
        solde: membre.solde,
        role: membre.role,
        statutmembre: membre.statutmembre,
        dateadhesion: membre.dateadhesion,
        nom: membre.personne?.nom,
        prenom: membre.personne?.prenom,
      },
      assemblee: membre.assemblee,
      stats: {
        inscriptions: inscriptionsCount,
        badges: badgesCount,
        departements: departementsCount,
        cotisationsActives,
        paiements: paiementsCount,
        paiementsValides,
      },
      notifications: {
        hasUnreadAnnouncement,
        hasLiveEnCours,
      },
      prochainesSeances,
    };
  }

  private async getProchainesSeances(idassemblee: number, limit: number) {
    const plannings = await this.prisma.assembleeplanning.findMany({
      where: { idassemblee },
      select: { idplanning: true },
    });

    const planningIds = plannings.map((p) => p.idplanning);
    if (planningIds.length === 0) return [];

    const now = new Date();

    return this.prisma.seance.findMany({
      where: {
        idplanning: { in: planningIds },
        heuredebut: { gte: now },
      },
      include: {
        activite: { select: { libelleactivite: true, imageurl: true } },
        planning: { select: { typeplanning: true } },
      },
      orderBy: { heuredebut: 'asc' },
      take: limit,
    });
  }

  async getMyInscriptions(
    user: Record<string, unknown>,
    page = 1,
    limit = 10,
    statut?: string,
  ) {
    const idmembre = this.parseIdMembre(user);
    const skip = (page - 1) * limit;
    const where: { idmembre: number; statut?: string } = { idmembre };
    if (statut) where.statut = statut;

    const [data, total] = await Promise.all([
      this.prisma.inscription.findMany({
        where: where as never,
        skip,
        take: limit,
        include: { activite: true },
        orderBy: { createat: 'desc' },
      }),
      this.prisma.inscription.count({ where: where as never }),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getMyPaiements(user: Record<string, unknown>, page = 1, limit = 10) {
    const idmembre = this.parseIdMembre(user);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.paiement.findMany({
        where: { idmembre },
        include: {
          cotisation: {
            select: { titre: true, description: true, date_debut: true, date_fin: true },
          },
        },
        orderBy: { createat: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paiement.count({ where: { idmembre } }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getMyCotisations(user: Record<string, unknown>, page = 1, limit = 10) {
    const idmembre = this.parseIdMembre(user);
    const idassemblee = this.parseIdAssemblee(user);
    const skip = (page - 1) * limit;

    const [cotisations, total] = await Promise.all([
      this.prisma.cotisation.findMany({
        where: { idassemblee },
        orderBy: { date_debut: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.cotisation.count({ where: { idassemblee } }),
    ]);

    const cotisationIds = cotisations.map((c) => c.id);
    const paiements =
      cotisationIds.length > 0
        ? await this.prisma.paiement.findMany({
            where: {
              idmembre,
              idcotisation: { in: cotisationIds },
            },
          })
        : [];

    const paiementMap = new Map(paiements.map((p) => [p.idcotisation, p]));

    const data = cotisations.map((cotisation) => {
      const paiement = paiementMap.get(cotisation.id);
      const now = new Date();
      const isActive =
        cotisation.date_debut <= now && cotisation.date_fin >= now;

      return {
        ...cotisation,
        isActive,
        monPaiement: paiement
          ? {
              id: paiement.id,
              montant: paiement.montant,
              statut: paiement.statut,
              code_transaction: paiement.code_transaction,
              createat: paiement.createat,
            }
          : null,
        estPaye: paiement?.statut === 'valide',
      };
    });

    return {
      data,
      meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
    };
  }

  async getMyBadges(user: Record<string, unknown>, limit?: number, offset = 0) {
    const idmembre = this.parseIdMembre(user);

    const [assignments, total] = await Promise.all([
      this.prisma.membre_badge.findMany({
        where: { idmembre },
        include: { badge: true },
        orderBy: { dateattribution: 'desc' },
        skip: offset,
        take: limit && limit > 0 ? limit : undefined,
      }),
      this.prisma.membre_badge.count({ where: { idmembre } }),
    ]);

    return {
      data: assignments.map((a) => ({
        ...a.badge,
        dateattribution: a.dateattribution,
      })),
      pagination: { total, limit: limit ?? null, offset },
    };
  }

  async getMyDepartements(user: Record<string, unknown>) {
    const idmembre = this.parseIdMembre(user);

    const ests = await this.prisma.est.findMany({
      where: { idmembre },
      include: {
        departement: {
          include: {
            profildepartement: true,
            assemblee: { select: { nomassemble: true } },
          },
        },
      },
      orderBy: { dateattribution: 'desc' },
    });

    const diriges = await this.prisma.dirige.findMany({
      where: { idmembre },
      select: { iddepartement: true },
    });
    const dirigeIds = new Set(diriges.map((d) => d.iddepartement));

    return {
      data: ests.map((e) => ({
        ...e.departement,
        dateattribution: e.dateattribution,
        estResponsable: dirigeIds.has(e.iddepartement),
      })),
      total: ests.length,
    };
  }

  async getAssembleeDepartements(idassemblee: number) {
    const assemblee = await this.prisma.assemblee.findUnique({
      where: { idassemblee },
      select: { idassemblee: true, nomassemble: true },
    });

    if (!assemblee) {
      throw new NotFoundException(`Assemblée ${idassemblee} introuvable`);
    }

    const departements = await this.prisma.departement.findMany({
      where: { idassemblee },
      include: {
        profildepartement: true,
        _count: { select: { est: true } },
      },
      orderBy: { nomdepartement: 'asc' },
    });

    return {
      assemblee,
      data: departements.map((d) => ({
        iddepartement: d.iddepartement,
        nomdepartement: d.nomdepartement,
        responsable: d.responsable,
        profildepartement: d.profildepartement,
        nombreMembres: d._count.est,
      })),
    };
  }

  async getAssembleeCalendrier(
    idassemblee: number,
    page = 1,
    limit = 20,
    scope: 'upcoming' | 'past' | 'all' = 'upcoming',
  ) {
    const assemblee = await this.prisma.assemblee.findUnique({
      where: { idassemblee },
      select: { idassemblee: true, nomassemble: true },
    });

    if (!assemblee) {
      throw new NotFoundException(`Assemblée ${idassemblee} introuvable`);
    }

    const assembleePlannings = await this.prisma.assembleeplanning.findMany({
      where: { idassemblee },
      select: { idplanning: true },
    });

    const planningIds = assembleePlannings.map((ap) => ap.idplanning);

    if (planningIds.length === 0) {
      return {
        assemblee,
        data: [],
        pagination: { total: 0, page, totalPages: 0 },
      };
    }

    const now = new Date();
    const baseWhere = { idplanning: { in: planningIds } };

    const scopeWhere =
      scope === 'upcoming'
        ? {
            ...baseWhere,
            OR: [
              { heurefin: { gte: now } },
              { heurefin: null, heuredebut: { gte: now } },
            ],
          }
        : scope === 'past'
          ? {
              ...baseWhere,
              OR: [
                { heurefin: { lt: now } },
                { heurefin: null, heuredebut: { lt: now } },
              ],
            }
          : baseWhere;

    const orderBy =
      scope === 'past'
        ? ({ heuredebut: 'desc' } as const)
        : ({ heuredebut: 'asc' } as const);

    const skip = (page - 1) * limit;

    const [seances, total] = await Promise.all([
      this.prisma.seance.findMany({
        where: scopeWhere,
        include: {
          activite: {
            select: { libelleactivite: true, imageurl: true },
          },
          intervenant: {
            select: { nomintervenant: true, prenomintervenant: true },
          },
          planning: {
            select: { typeplanning: true, etatplanning: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.seance.count({
        where: scopeWhere,
      }),
    ]);

    const data = seances.map((seance) => ({
      idseance: seance.idseance,
      titreseance: seance.titreseance,
      lieu: seance.lieu,
      heuredebut: seance.heuredebut,
      heurefin: seance.heurefin,
      statutseance: seance.statutseance,
      activite: seance.activite,
      typeplanning: seance.planning?.typeplanning,
      etatplanning: seance.planning?.etatplanning,
      intervenant: seance.intervenant
        ? {
            nom: seance.intervenant.nomintervenant,
            prenom: seance.intervenant.prenomintervenant,
          }
        : null,
    }));

    return {
      assemblee,
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getDepartementMembres(iddepartement: number, page = 1, limit = 20) {
    const departement = await this.prisma.departement.findUnique({
      where: { iddepartement },
      select: {
        iddepartement: true,
        nomdepartement: true,
        responsable: true,
      },
    });

    if (!departement) {
      throw new NotFoundException(`Département ${iddepartement} introuvable`);
    }

    const skip = (page - 1) * limit;

    const [ests, total] = await Promise.all([
      this.prisma.est.findMany({
        where: { iddepartement },
        include: {
          membre: {
            include: {
              personne: {
                include: { profilpersonne: { take: 1 } },
              },
            },
          },
        },
        orderBy: { dateattribution: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.est.count({ where: { iddepartement } }),
    ]);

    return {
      departement,
      data: ests.map((e) => {
        const membre = e.membre;
        const personne = membre?.personne;
        const profil = personne?.profilpersonne?.[0] ?? null;
        return {
          idmembre: membre?.idmembre,
          codemembre: membre?.codemembre,
          role: membre?.role,
          nom: personne?.nom,
          prenom: personne?.prenom,
          photourl: profil?.photourl ?? null,
          dateattribution: e.dateattribution,
        };
      }),
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getTypesActivites() {
    return this.prisma.typeactivites.findMany({
      orderBy: { nomtypeactivite: 'asc' },
    });
  }

  async getTypesAnnonces() {
    return this.prisma.typeannonce.findMany({
      orderBy: { nomtypeannonce: 'asc' },
    });
  }

  async getBadgesReferentiel(limit = 50, offset = 0) {
    const [data, total] = await Promise.all([
      this.prisma.badge.findMany({
        orderBy: { nombadge: 'asc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.badge.count(),
    ]);

    return { data, pagination: { total, limit, offset } };
  }

  private async getMyResourceIds(idmembre: number) {
    const [publications, lives] = await Promise.all([
      this.prisma.publication.findMany({
        where: { idmembre },
        select: { idpublication: true },
      }),
      this.prisma.live.findMany({
        where: { idmembre },
        select: { idlive: true },
      }),
    ]);

    return {
      publicationIds: publications.map((p) => p.idpublication),
      liveIds: lives.map((l) => l.idlive),
    };
  }

  private buildResourceFilter(publicationIds: number[], liveIds: number[]) {
    const conditions: Array<{
      ressourcetype: string;
      ressourceid: { in: number[] };
    }> = [];

    if (publicationIds.length > 0) {
      conditions.push({
        ressourcetype: 'publication',
        ressourceid: { in: publicationIds },
      });
    }
    if (liveIds.length > 0) {
      conditions.push({
        ressourcetype: 'live',
        ressourceid: { in: liveIds },
      });
    }

    return conditions;
  }

  async getAccountOverview(user: Record<string, unknown>) {
    const idmembre = this.parseIdMembre(user);
    const { publicationIds, liveIds } = await this.getMyResourceIds(idmembre);
    const resourceConditions = this.buildResourceFilter(publicationIds, liveIds);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const receivedWhere =
      resourceConditions.length > 0 ? { OR: resourceConditions } : null;

    const [
      publicationsTotal,
      publicationsPublished,
      likesReceived,
      commentsReceived,
      sharesReceived,
      viewsReceived,
      recentActivity,
      myLikesGiven,
      myCommentsGiven,
      mySharesGiven,
    ] = await Promise.all([
      this.prisma.publication.count({ where: { idmembre } }),
      this.prisma.publication.count({
        where: { idmembre, statutpublication: 'publie' },
      }),
      receivedWhere
        ? this.prisma.interaction.count({
            where: { ...receivedWhere, type: 'like' },
          })
        : 0,
      receivedWhere
        ? this.prisma.interaction.count({
            where: { ...receivedWhere, type: 'commentaire' },
          })
        : 0,
      receivedWhere
        ? this.prisma.interaction.count({
            where: { ...receivedWhere, type: 'partage' },
          })
        : 0,
      receivedWhere
        ? this.prisma.interaction.count({
            where: { ...receivedWhere, type: 'vue' },
          })
        : 0,
      receivedWhere
        ? this.prisma.interaction.count({
            where: { ...receivedWhere, createat: { gte: sevenDaysAgo } },
          })
        : 0,
      this.prisma.interaction.count({
        where: { idmembre, type: 'like' },
      }),
      this.prisma.interaction.count({
        where: { idmembre, type: 'commentaire' },
      }),
      this.prisma.interaction.count({
        where: { idmembre, type: 'partage' },
      }),
    ]);

    return {
      contenu: {
        publicationsTotal,
        publicationsPublished,
        livesTotal: liveIds.length,
      },
      engagementRecu: {
        likes: likesReceived,
        commentaires: commentsReceived,
        partages: sharesReceived,
        vues: viewsReceived,
        total: likesReceived + commentsReceived + sharesReceived + viewsReceived,
        recent7jours: recentActivity,
      },
      monActivite: {
        likesDonnes: myLikesGiven,
        commentairesDonnes: myCommentsGiven,
        partagesDonnes: mySharesGiven,
      },
    };
  }

  async getContentInsights(
    user: Record<string, unknown>,
    page = 1,
    limit = 10,
  ) {
    const idmembre = this.parseIdMembre(user);
    const skip = (page - 1) * limit;

    const [publications, total] = await Promise.all([
      this.prisma.publication.findMany({
        where: { idmembre },
        orderBy: { createat: 'desc' },
        skip,
        take: limit,
        select: {
          idpublication: true,
          titre: true,
          description: true,
          mediaurl: true,
          typepublication: true,
          statutpublication: true,
          createat: true,
        },
      }),
      this.prisma.publication.count({ where: { idmembre } }),
    ]);

    const pubIds = publications.map((p) => p.idpublication);

    const countsByPub = new Map<
      number,
      { likes: number; commentaires: number; partages: number; vues: number }
    >();

    if (pubIds.length > 0) {
      const grouped = await this.prisma.interaction.groupBy({
        by: ['ressourceid', 'type'],
        where: {
          ressourcetype: 'publication',
          ressourceid: { in: pubIds },
        },
        _count: { idinteraction: true },
      });

      for (const row of grouped) {
        if (row.ressourceid == null) continue;
        const current = countsByPub.get(row.ressourceid) ?? {
          likes: 0,
          commentaires: 0,
          partages: 0,
          vues: 0,
        };
        const count = row._count.idinteraction;
        if (row.type === 'like') current.likes = count;
        else if (row.type === 'commentaire') current.commentaires = count;
        else if (row.type === 'partage') current.partages = count;
        else if (row.type === 'vue') current.vues = count;
        countsByPub.set(row.ressourceid, current);
      }
    }

    const data = publications.map((pub) => {
      const stats = countsByPub.get(pub.idpublication) ?? {
        likes: 0,
        commentaires: 0,
        partages: 0,
        vues: 0,
      };
      return {
        ...pub,
        engagement: {
          ...stats,
          total: stats.likes + stats.commentaires + stats.partages + stats.vues,
        },
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getActivityFeed(
    user: Record<string, unknown>,
    page = 1,
    limit = 20,
    type?: string,
  ) {
    const idmembre = this.parseIdMembre(user);
    const { publicationIds, liveIds } = await this.getMyResourceIds(idmembre);
    const resourceConditions = this.buildResourceFilter(publicationIds, liveIds);

    if (resourceConditions.length === 0) {
      return {
        data: [],
        pagination: { total: 0, page, totalPages: 0 },
      };
    }

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {
      OR: resourceConditions,
      idmembre: { not: idmembre },
    };
    if (type && type !== 'all') {
      where.type = type;
    }

    const [interactions, total] = await Promise.all([
      this.prisma.interaction.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { createat: 'desc' },
        include: {
          membre: {
            include: {
              personne: {
                include: { profilpersonne: { take: 1 } },
              },
            },
          },
        },
      }),
      this.prisma.interaction.count({ where: where as never }),
    ]);

    const pubIdsNeeded = interactions
      .filter((i) => i.ressourcetype === 'publication' && i.ressourceid)
      .map((i) => i.ressourceid as number);
    const liveIdsNeeded = interactions
      .filter((i) => i.ressourcetype === 'live' && i.ressourceid)
      .map((i) => i.ressourceid as number);

    const pubs =
      pubIdsNeeded.length > 0
        ? await this.prisma.publication.findMany({
            where: { idpublication: { in: [...new Set(pubIdsNeeded)] } },
            select: {
              idpublication: true,
              titre: true,
              mediaurl: true,
              typepublication: true,
            },
          })
        : [];
    const lives =
      liveIdsNeeded.length > 0
        ? await this.prisma.live.findMany({
            where: { idlive: { in: [...new Set(liveIdsNeeded)] } },
            select: { idlive: true, titrelive: true, videourl: true },
          })
        : [];

    const pubMap = new Map<number, (typeof pubs)[number]>();
    pubs.forEach((p) => pubMap.set(p.idpublication, p));
    const liveMap = new Map<number, (typeof lives)[number]>();
    lives.forEach((l) => liveMap.set(l.idlive, l));

    const data = interactions.map((interaction) => {
      const personne = interaction.membre.personne;
      const profil = personne.profilpersonne?.[0] ?? null;
      const ressource =
        interaction.ressourcetype === 'publication'
          ? pubMap.get(interaction.ressourceid ?? 0)
          : liveMap.get(interaction.ressourceid ?? 0);

      return {
        id: interaction.idinteraction,
        type: interaction.type,
        contenu: interaction.contenu,
        date: interaction.createat,
        ressourcetype: interaction.ressourcetype,
        ressourceid: interaction.ressourceid,
        ressource: ressource ?? null,
        membre: {
          id: interaction.membre.idmembre,
          nom: personne.nom,
          prenom: personne.prenom,
          photo: profil?.photourl ?? null,
          role: interaction.membre.role,
        },
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getPublicationEngagement(
    user: Record<string, unknown>,
    idpublication: number,
    type?: string,
    limit = 20,
    offset = 0,
  ) {
    const idmembre = this.parseIdMembre(user);

    const publication = await this.prisma.publication.findUnique({
      where: { idpublication },
      select: { idmembre: true, titre: true, mediaurl: true, typepublication: true },
    });

    if (!publication) {
      throw new NotFoundException('Publication introuvable');
    }
    if (publication.idmembre !== idmembre) {
      throw new UnauthorizedException(
        'Vous ne pouvez consulter que vos propres publications',
      );
    }

    const where: Record<string, unknown> = {
      ressourcetype: 'publication',
      ressourceid: idpublication,
    };
    if (type && type !== 'all') {
      where.type = type;
    }

    const [interactions, total] = await Promise.all([
      this.prisma.interaction.findMany({
        where: where as never,
        skip: offset,
        take: limit,
        orderBy: { createat: 'desc' },
        include: {
          membre: {
            include: {
              personne: {
                include: { profilpersonne: { take: 1 } },
              },
            },
          },
        },
      }),
      this.prisma.interaction.count({ where: where as never }),
    ]);

    const grouped = await this.prisma.interaction.groupBy({
      by: ['type'],
      where: {
        ressourcetype: 'publication',
        ressourceid: idpublication,
      },
      _count: { idinteraction: true },
    });

    const stats = { likes: 0, commentaires: 0, partages: 0, vues: 0, total: 0 };
    for (const row of grouped) {
      const count = row._count.idinteraction;
      if (row.type === 'like') stats.likes = count;
      else if (row.type === 'commentaire') stats.commentaires = count;
      else if (row.type === 'partage') stats.partages = count;
      else if (row.type === 'vue') stats.vues = count;
      stats.total += count;
    }

    return {
      publication: {
        idpublication,
        titre: publication.titre,
        mediaurl: publication.mediaurl,
        typepublication: publication.typepublication,
      },
      stats,
      data: interactions.map((interaction) => {
        const personne = interaction.membre.personne;
        const profil = personne.profilpersonne?.[0] ?? null;
        return {
          id: interaction.idinteraction,
          type: interaction.type,
          contenu: interaction.contenu,
          date: interaction.createat,
          membre: {
            id: interaction.membre.idmembre,
            nom: personne.nom,
            prenom: personne.prenom,
            photo: profil?.photourl ?? null,
            role: interaction.membre.role,
          },
        };
      }),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getMyInteractions(
    user: Record<string, unknown>,
    page = 1,
    limit = 20,
    type?: string,
  ) {
    const idmembre = this.parseIdMembre(user);
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { idmembre };
    if (type && type !== 'all') {
      where.type = type;
    }

    const [interactions, total] = await Promise.all([
      this.prisma.interaction.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { createat: 'desc' },
      }),
      this.prisma.interaction.count({ where: where as never }),
    ]);

    const pubIds = interactions
      .filter((i) => i.ressourcetype === 'publication' && i.ressourceid)
      .map((i) => i.ressourceid as number);
    const liveIds = interactions
      .filter((i) => i.ressourcetype === 'live' && i.ressourceid)
      .map((i) => i.ressourceid as number);

    const pubs =
      pubIds.length > 0
        ? await this.prisma.publication.findMany({
            where: { idpublication: { in: [...new Set(pubIds)] } },
            select: {
              idpublication: true,
              titre: true,
              mediaurl: true,
              typepublication: true,
              idmembre: true,
            },
          })
        : [];
    const lives =
      liveIds.length > 0
        ? await this.prisma.live.findMany({
            where: { idlive: { in: [...new Set(liveIds)] } },
            select: {
              idlive: true,
              titrelive: true,
              videourl: true,
              idmembre: true,
            },
          })
        : [];

    const pubMap = new Map<number, (typeof pubs)[number]>();
    pubs.forEach((p) => pubMap.set(p.idpublication, p));
    const liveMap = new Map<number, (typeof lives)[number]>();
    lives.forEach((l) => liveMap.set(l.idlive, l));

    const data = interactions.map((interaction) => {
      const ressource =
        interaction.ressourcetype === 'publication'
          ? pubMap.get(interaction.ressourceid ?? 0)
          : liveMap.get(interaction.ressourceid ?? 0);

      return {
        id: interaction.idinteraction,
        type: interaction.type,
        contenu: interaction.contenu,
        date: interaction.createat,
        ressourcetype: interaction.ressourcetype,
        ressourceid: interaction.ressourceid,
        ressource: ressource ?? null,
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
