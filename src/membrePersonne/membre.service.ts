import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';


interface SearchParams {
  nom?: string;
  telephone?: string;
  take: number;
  skip: number;
}
@Injectable()
export class MembreService {
  constructor(private prisma: PrismaService) {}

  async getMembresActifs(limit: number, offset: number) {
    return this.prisma.membre.findMany({
      where: { statutmembre: 'actif' },
      include: {
        personne: {
          include: {
            profilpersonne: true,
          },
        },
      },
      orderBy: { createat: 'desc' },
      take: limit,
      skip: offset,
    });
  }

   async searchMembresActifs(params: SearchParams) {
    const { nom, telephone, take, skip } = params;

    // Construire la condition where dynamiquement
    const where: any = {
      statutmembre: 'actif',
      AND: [],
    };

    if (nom) {
      where.AND.push({
        personne: {
          OR: [
            { nom: { contains: nom, mode: 'insensitive' } },
            { prenom: { contains: nom, mode: 'insensitive' } },
          ],
        },
      });
    }

    if (telephone) {
      where.AND.push({
        personne: {
          telephone: { contains: telephone, mode: 'insensitive' },
        },
      });
    }

    // Si aucun filtre n’est passé, on retire le AND pour ne pas bloquer la recherche
    if (where.AND.length === 0) {
      delete where.AND;
    }

    return this.prisma.membre.findMany({
      where,
      include: {
        personne: {
          include: {
            profilpersonne: true,
          },
        },
      },
      orderBy: { createat: 'desc' },
      take,
      skip,
    });
  }


   async getMembresByAssemblee(
  nomAssemblee: string,
  take: number,
  skip: number,
) {
  return this.prisma.membre.findMany({
    where: {
      statutmembre: 'actif',
      assemblee: {
        nomassemble: {
          contains: nomAssemblee, // recherche partielle
          mode: 'insensitive',   // insensible à la casse
        },
      },
    },
    include: {
      personne: {
        include: {
          profilpersonne: true,
        },
      },
      assemblee: true,
    },
    orderBy: { createat: 'desc' },
    take,
    skip,
  });
}

}
