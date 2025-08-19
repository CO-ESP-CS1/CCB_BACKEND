import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVideoPublicationDto } from './dto/create-video-publication.dto';

@Injectable()
export class VideoPublicationService {
  constructor(private readonly prisma: PrismaService) {}

  async createVideoPublication(dto: CreateVideoPublicationDto, idmembre: number) {
    try {
      return await this.prisma.publication.create({
        data: {
          titre: dto.titre,
          description: dto.description || null,
          mediaurl: dto.mediaurl,
          expirationdate: null,
          statutpublication: 'en_attente',
          typepublication: 'VIDEO',
          esttemporaire: false,
          idmembre,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création de la publication vidéo :', error);
      throw new InternalServerErrorException('Impossible de créer la publication vidéo');
    }
  }

  async getPublishedVideoPublications(limit = 10, offset = 0) {
    try {
      return await this.prisma.publication.findMany({
        where: {
          typepublication: 'VIDEO',
          statutpublication: 'publie',
        },
        take: limit,
        skip: offset,
        orderBy: { createat: 'desc' },
        include: {
          membre: {
            select: {
              idmembre: true,
              codemembre: true,
              personne: {
                select: {
                  idpersonne: true,
                  nom: true,
                  prenom: true,
                  email: true,
                  profilpersonne: {
                    select: {
                      photourl: true,
                    },
                    take: 1, // profilpersonne[] => on prend le premier profil
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des publications vidéo :', error);
      throw new InternalServerErrorException('Impossible de récupérer les publications vidéo');
    }
  }

}
