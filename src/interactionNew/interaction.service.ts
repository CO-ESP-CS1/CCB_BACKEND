import { Injectable, ForbiddenException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInteractionNewDto } from './dto/create-interaction.dto';
import { ResourceInteractionsDto } from './dto/resource-interactions.dto';
import { interaction_type_enum, statut_publication_enum, statut_live_enum } from '@prisma/client';

@Injectable()
export class InteractionService {
  constructor(private prisma: PrismaService) {}

  async createInteraction(dto: CreateInteractionNewDto, idmembre: number) {
    // Validation spécifique
    if ((dto.type === 'commentaire' || dto.type === 'signale') && !dto.contenu) {
      throw new ForbiddenException(
        'Le contenu est obligatoire pour ce type d\'interaction',
      );
    }

    // Vérifier que le type de ressource est valide
    if (!['publication', 'live'].includes(dto.ressourcetype)) {
      throw new ForbiddenException('Type de ressource invalide. Doit être "publication" ou "live"');
    }

    // Vérifier l'existence et le statut de la ressource
    let resourceExists = false;
    let statusValid = false;

    if (dto.ressourcetype === 'publication' && dto.ressourceid) {
      const publication = await this.prisma.publication.findUnique({
        where: { idpublication: dto.ressourceid },
      });

      resourceExists = !!publication;
      statusValid = publication?.statutpublication === statut_publication_enum.publie;
    } 
    else if (dto.ressourcetype === 'live' && dto.ressourceid) {
      const live = await this.prisma.live.findUnique({
        where: { idlive: dto.ressourceid },
      });

      resourceExists = !!live;
      statusValid = live?.statutlive === statut_live_enum.en_cours;
    }

    // Gestion des erreurs
    if (!resourceExists) {
      throw new ForbiddenException(`${dto.ressourcetype} introuvable`);
    }

    if (!statusValid) {
      throw new ForbiddenException(
        `La ${dto.ressourcetype} n'est pas dans un état permettant les interactions`
      );
    }

    // Vérifier si l'interaction existe déjà pour ce membre et cette ressource
    // Sauf pour les commentaires qui peuvent être multiples
    if (dto.type !== 'commentaire') {
      const existingInteraction = await this.prisma.interaction.findFirst({
        where: {
          type: dto.type,
          ressourcetype: dto.ressourcetype,
          ressourceid: dto.ressourceid,
          idmembre: idmembre
        }
      });

      if (existingInteraction) {
        throw new ConflictException(
          'Une interaction de ce type existe déjà pour cette ressource et ce membre'
        );
      }
    }

    // Création de l'interaction
    return this.prisma.interaction.create({
      data: {
        type: dto.type,
        ressourcetype: dto.ressourcetype,
        ressourceid: dto.ressourceid,
        contenu: dto.contenu,
        idmembre: idmembre,
      },
    });
  }
  async getResourceInteractions(
    ressourceType: string,
    ressourceId: number,
    interactionType?: string,
    limit: number = 10,
    offset: number = 0
  ) {
    // Vérification du type de ressource
    if (!['publication', 'live'].includes(ressourceType)) {
      throw new NotFoundException('Type de ressource non valide');
    }

    // Construction de la condition WHERE
    const where: any = {
      ressourcetype: ressourceType,
      ressourceid: ressourceId,
    };

    // Ajout du filtre par type d'interaction si spécifié
    if (interactionType && interactionType !== 'all') {
      where.type = interactionType;
    }

    // Requête pour les interactions
    const interactions = await this.prisma.interaction.findMany({
      where,
      skip: offset,
      take: limit,
      include: {
        membre: {
          include: {
            personne: {
              include: {
                profilpersonne: true,
              },
            },
          },
        },
      },
      orderBy: {
        createat: 'desc', // Tri par date de création décroissante
      },
    });

    // Requête pour le nombre total d'interactions
    const total = await this.prisma.interaction.count({ where });

    return {
      data: interactions.map(interaction => ({
        id: interaction.idinteraction,
        type: interaction.type,
        contenu: interaction.contenu,
        date_creation: interaction.createat,
        membre: {
          id: interaction.membre.idmembre,
          nom: interaction.membre.personne.nom,
          prenom: interaction.membre.personne.prenom,
          photo: interaction.membre.personne.profilpersonne[0]?.photourl || null,
          role: interaction.membre.role,
        },
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }
}