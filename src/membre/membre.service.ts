import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMembreDto } from './dto/create-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';
import { Prisma, statut_membre_enum, role_enum } from '@prisma/client';

@Injectable()
export class MembreService {
  private readonly MAX_TAKE = 100;
  private readonly DEFAULT_SKIP = 0;
  private readonly DEFAULT_TAKE = 10;

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMembreDto) {
    return this.prisma.membre.create({
      data: dto as Prisma.membreUncheckedCreateInput,
      include: this.includeRelations(),
    });
  }


  
  
async getMembreStatsByAssemblee(idassemblee: number) {
  // Vérifier si l'assemblée existe (optionnel)
  const assembleeExists = await this.prisma.assemblee.findUnique({
    where: { idassemblee },
  });
  if (!assembleeExists) {
    throw new NotFoundException(`Assemblée avec id ${idassemblee} non trouvée`);
  }

  // Total de membres pour cette assemblée
  const total = await this.prisma.membre.count({
    where: { idassemblee },
  });

  // Nouveaux membres des 7 derniers jours pour cette assemblée
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const nouveaux7jours = await this.prisma.membre.count({
    where: {
      idassemblee,
      createat: {
        gte: sevenDaysAgo,
      },
    },
  });

  return { idassemblee, total, nouveaux7jours };
}


async getMembreStats() {
  const total = await this.prisma.membre.count();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const nouveaux = await this.prisma.membre.count({
    where: {
      createat: {
        gte: sevenDaysAgo,
      },
    },
  });

  return { total, nouveaux7jours: nouveaux };
}







async findAll(
  skip: number = this.DEFAULT_SKIP,
  take: number = this.DEFAULT_TAKE,
  statut?: string,
  role?: string,
  idassemblee?: number,
  iddepartement?: number
) {
  // Validation
  if (take > this.MAX_TAKE) {
    throw new BadRequestException(`Vous ne pouvez pas récupérer plus de ${this.MAX_TAKE} éléments à la fois`);
  }

  // Construction des filtres
  const where: Prisma.membreWhereInput = {};
  
  // Vérification et conversion du statut
  if (statut) {
    if (!Object.values(statut_membre_enum).includes(statut as statut_membre_enum)) {
      throw new BadRequestException(`Statut invalide: ${statut}`);
    }
    where.statutmembre = statut as statut_membre_enum;
  }
  
  // Vérification et conversion du rôle
  if (role) {
    if (!Object.values(role_enum).includes(role as role_enum)) {
      throw new BadRequestException(`Rôle invalide: ${role}`);
    }
    where.role = role as role_enum;
  }
  
  if (idassemblee) where.idassemblee = idassemblee;
  
  if (iddepartement) {
    where.est = {
      some: {
        iddepartement: iddepartement
      }
    };
  }

  const [membres, total] = await Promise.all([
    this.prisma.membre.findMany({
      skip,
      take,
      where,
      include: this.includeRelations(),
      orderBy: [
        { createat: 'desc' },  // Priorité au tri par date de création (les plus récents en premier)
        { idmembre: 'asc' }     // Tri secondaire sur idmembre
      ]
    }),
    this.prisma.membre.count({ where })
  ]);

  return {
    data: membres,
    pagination: {
      total,
      skip,
      take,
      hasMore: skip + take < total,
      currentPage: Math.floor(skip / take) + 1,
      totalPages: Math.ceil(total / take) || 1
    }
  };
}

 async findOne(id: number) {
  const membre = await this.prisma.membre.findUnique({
    where: { idmembre: id },
    include: {
      personne: {
        include: {
          profilpersonne: true,
        },
      },
      assemblee: true,
      est: true, // Si nécessaire
    }
  });
  
  if (!membre) throw new NotFoundException('Membre non trouvé');
  
  // Extraire le premier profil
  const profil = membre.personne?.profilpersonne?.[0] || null;
  
  return {
    ...membre,
    personne: membre.personne ? {
      ...membre.personne,
      profil // Ajoute le profil directement dans l'objet personne
    } : null
  };
}

  async update(id: number, dto: UpdateMembreDto) {
    await this.findOne(id);
    
    const data: any = { updateat: new Date() };
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined) data[key] = value;
    });
    
    return this.prisma.membre.update({
      where: { idmembre: id },
      data,
      include: this.includeRelations()
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.membre.delete({
      where: { idmembre: id },
      include: this.includeRelations()
    });
  }

  private includeRelations() {
    return {
      personne: true,
      assemblee: true,
      est: {
        include: {
          departement: true
        }
      }
    };
  }






  async getProfileByMembreId(idmembre: number) {
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre },
      include: {
        personne: {
          include: {
            profilpersonne: true, // récupère le tableau
          },
        },
      },
    });

    if (!membre) {
      throw new NotFoundException(`Membre with id ${idmembre} not found`);
    }

    const personne = membre.personne ?? null;
    const profil = personne?.profilpersonne?.[0] ?? null;

    return {
      ...membre,
      personne: personne
        ? {
            ...personne,
            profil, // on ajoute un champ pratique "profil" contenant le premier profil ou null
          }
        : null,
    };
  }
}