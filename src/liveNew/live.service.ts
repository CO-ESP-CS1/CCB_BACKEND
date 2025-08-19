import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLiveDto } from './dto/create-live.dto';

@Injectable()
export class LiveService {
  constructor(private readonly prisma: PrismaService) {}

  async createLive(dto: CreateLiveDto, idmembre: number) {
    try {
      if (!dto.titrelive) {
        throw new BadRequestException('Le titre du live est obligatoire');
      }
      if (!dto.descriptionlive) {
        throw new BadRequestException('La description du live est obligatoire');
      }
      if (!dto.heuredebut || !dto.heurefin) {
        throw new BadRequestException('Les heures de début et fin sont obligatoires');
      }

      // Valider membre existant
      const membre = await this.prisma.membre.findUnique({ where: { idmembre } });
      if (!membre) {
        throw new NotFoundException(`Membre avec id ${idmembre} non trouvé`);
      }

      // Valider seance si fournie
      if (dto.idseance !== undefined && dto.idseance !== null) {
        const seance = await this.prisma.seance.findUnique({ where: { idseance: dto.idseance } });
        if (!seance) {
          throw new NotFoundException(`Séance avec id ${dto.idseance} non trouvée`);
        }
      }

      const heureDebut = new Date(dto.heuredebut);
      const heureFin = new Date(dto.heurefin);
      if (isNaN(heureDebut.getTime()) || isNaN(heureFin.getTime())) {
        throw new BadRequestException('Les heures de début ou fin ne sont pas valides');
      }
      if (heureFin <= heureDebut) {
        throw new BadRequestException('L\'heure de fin doit être après l\'heure de début');
      }

      return await this.prisma.live.create({
        data: {
          titrelive: dto.titrelive,
          descriptionlive: dto.descriptionlive,
          videourl: dto.videourl || null,
          statutlive: 'en_cours',
          heuredebut: heureDebut,
          heurefin: heureFin,
          idseance: dto.idseance || null,
          idmembre,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création du live :', error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Impossible de créer le live');
    }
  }



  async getLivesWithAuthors(limit = 10, offset = 0) {
    try {
      return await this.prisma.live.findMany({
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
                    take: 1,  // profilpersonne[] donc on prend le premier
                  },
                },
              },
            },
          },
          seance: true, // optionnel si tu veux info séance
        },
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des lives :', error);
      throw new InternalServerErrorException('Impossible de récupérer les lives');
    }
  }
}
