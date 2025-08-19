import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShortDto } from './dto/create-short.dto';

@Injectable()
export class ShortPublicationService {
  constructor(private readonly prisma: PrismaService) {}

async createShort(dto: CreateShortDto) {
  if (dto.idmembre === undefined) {
    throw new InternalServerErrorException('idmembre must be defined');
  }

  try {
    return await this.prisma.$transaction(async (tx) => {
      return tx.publication.create({
        data: {
          titre: dto.titre || null,
          description: dto.description || null,
          mediaurl: dto.mediaurl,
          expirationdate: null,
          statutpublication: 'en_attente',
          typepublication: 'SHORT',
          esttemporaire: false,
          idmembre: dto.idmembre,
        },
      });
    });
  } catch (error) {
    console.error('Erreur lors de la création du short :', error);
    throw new InternalServerErrorException('Impossible de créer le short');
  }
}

// src/publication/publication.service.ts
async getPublishedShortPublications(limit = 10, offset = 0) {
  try {
    return await this.prisma.publication.findMany({
      where: {
        typepublication: 'SHORT',
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
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des publications short :', error);
    throw new InternalServerErrorException('Impossible de récupérer les publications short');
  }
}


}
