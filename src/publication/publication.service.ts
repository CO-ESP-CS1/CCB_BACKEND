import { 
  Injectable, 
  ForbiddenException,
  NotFoundException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { statut_publication_enum, type_publication_enum } from '@prisma/client';

@Injectable()
export class PublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePublicationDto) {
    const { expirationdate, ...rest } = dto;
  
    const data = {
      ...rest,
      expirationdate: expirationdate ? new Date(expirationdate) : null,
      createat: new Date(),
      updateat: new Date(),
    } as Prisma.publicationUncheckedCreateInput;
  
    return this.prisma.publication.create({ data });
  }

  // Vérifie si l'utilisateur a le badge "publicationAutre"
  async checkPublicationAutreBadge(userId: number): Promise<boolean> {
    const badge = await this.prisma.badge.findFirst({
      where: { nombadge: 'publicationAutre' },
    });

    if (!badge) return false;

    const memberBadge = await this.prisma.membre_badge.findFirst({
      where: { idmembre: userId, idbadge: badge.idbadge },
    });

    return !!memberBadge;
  }

  // Vérifie si l'utilisateur a le badge "supprimerPubAutre"
  async checkSupprimerPubAutreBadge(userId: number): Promise<boolean> {
    const badge = await this.prisma.badge.findFirst({
      where: { nombadge: 'supprimerPubAutre' },
    });

    if (!badge) return false;

    const memberBadge = await this.prisma.membre_badge.findFirst({
      where: { idmembre: userId, idbadge: badge.idbadge },
    });

    return !!memberBadge;
  }

  async findForUser(params: {
    targetId: number;
    statut?: statut_publication_enum;
    type?: type_publication_enum;
    hasPublicationAutreBadge: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { 
      targetId, 
      statut, 
      type, 
      hasPublicationAutreBadge,
      limit = 20, // Limite par défaut
      offset = 0  // Offset par défaut
    } = params;
    
    // Construire le filtre WHERE
    const where: Prisma.publicationWhereInput = {
      idmembre: targetId
    };

    // Gestion des statuts pour ceux qui n'ont pas le badge spécial
    if (!hasPublicationAutreBadge) {
      where.OR = [
        { statutpublication: { notIn: ['desactive', 'archive'] } },
        { statutpublication: null }
      ];
    }

    // Appliquer les filtres optionnels
    if (statut) where.statutpublication = statut;
    if (type) where.typepublication = type;

    // Requête optimisée avec pagination
    return this.prisma.publication.findMany({
      where,
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
        membre: {
          select: {
            idmembre: true,
          
          }
        }
      }
    });
  }

  async findAll(limit?: number, offset?: number) {
    return this.prisma.publication.findMany({
      take: limit,
      skip: offset,
      orderBy: { createat: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.publication.findUnique({
      where: { idpublication: id },
    });
  }

  async update(id: number, dto: UpdatePublicationDto) {
    const data = {
      ...dto,
      updateat: new Date(),
    } as Prisma.publicationUncheckedUpdateInput;

    return this.prisma.publication.update({
      where: { idpublication: id },
      data,
    });
  }

  async remove(id: number, userId: number, hasSupprimerBadge: boolean) {
    // Récupérer la publication
    const publication = await this.prisma.publication.findUnique({
      where: { idpublication: id },
    });

    if (!publication) {
      throw new NotFoundException('Publication non trouvée');
    }

    // Vérifier les droits de suppression
    const isOwner = publication.idmembre === userId;
    if (!isOwner && !hasSupprimerBadge) {
      throw new ForbiddenException('Vous n\'avez pas les droits de suppression');
    }

    // Suppression en cascade dans une transaction
    return this.prisma.$transaction(async (prisma) => {
      // Supprimer toutes les relations dépendantes
      await Promise.all([
        // Interactions
        prisma.interaction.deleteMany({
          where: {
            ressourcetype: 'publication',
            ressourceid: id,
          },
        }),
        
        // Actions de publication
        prisma.publication_action.deleteMany({
          where: { idpublication: id },
        }),
      ]);

      // Enfin, supprimer la publication elle-même
      return prisma.publication.delete({
        where: { idpublication: id },
      });
    });
  }


  async hasPendingPublications(): Promise<boolean> {
  const count = await this.prisma.publication.count({
    where: {
      statutpublication: 'en_attente'
    }
  });

  return count > 0;
}
}