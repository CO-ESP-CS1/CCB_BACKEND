import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

@Injectable()
export class PaiementService {
  constructor(private prisma: PrismaService) {}

async create(createPaiementDto: CreatePaiementDto) {
  // Vérifier si le membre existe
  const membre = await this.prisma.membre.findUnique({
    where: { idmembre: createPaiementDto.idmembre },
  });

  if (!membre) {
    throw new NotFoundException(`Membre avec ID ${createPaiementDto.idmembre} non trouvé`);
  }

  // Vérifier si la cotisation existe
  const cotisation = await this.prisma.cotisation.findUnique({
    where: { id: createPaiementDto.idcotisation },
  });

  if (!cotisation) {
    throw new NotFoundException(`Cotisation avec ID ${createPaiementDto.idcotisation} non trouvée`);
  }

  // Générer un code de transaction si non fourni
  let codeTransaction = createPaiementDto.code_transaction || `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Vérifier unicité du code de transaction
  let exists = await this.prisma.paiement.findUnique({
    where: { code_transaction: codeTransaction },
  });

  // Si déjà utilisé, regénérer jusqu'à trouver un code unique
  while (exists) {
    codeTransaction = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    exists = await this.prisma.paiement.findUnique({
      where: { code_transaction: codeTransaction },
    });
  }

  return this.prisma.paiement.create({
    data: {
      idmembre: createPaiementDto.idmembre,
      idcotisation: createPaiementDto.idcotisation,
      montant: createPaiementDto.montant,
      code_transaction: codeTransaction,
      statut: createPaiementDto.statut || 'en_attente', 
      createat: new Date(),
    },
    include: {
      membre: {
        include: {
          personne: true,
        },
      },
      cotisation: true,
    },
  });
}

  async findAll(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.paiement.findMany({
      include: {
        membre: { include: { personne: true } },
        cotisation: true,
      },
      orderBy: { createat: 'desc' },
      skip,
      take: limit,
    }),
    this.prisma.paiement.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

  async findOne(id: number) {
    const paiement = await this.prisma.paiement.findUnique({
      where: { id },
      include: {
        membre: {
          include: {
            personne: true,
          },
        },
        cotisation: true,
      },
    });

    if (!paiement) {
      throw new NotFoundException(`Paiement avec ID ${id} non trouvé`);
    }

    return paiement;
  }

  async update(id: number, updatePaiementDto: UpdatePaiementDto) {
    try {
      return await this.prisma.paiement.update({
        where: { id },
        data: updatePaiementDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Paiement avec ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.paiement.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Paiement avec ID ${id} non trouvé`);
      }
      throw error;
    }
  }

async findByMembre(idmembre: number, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    this.prisma.paiement.findMany({
      where: { idmembre },
      include: { cotisation: true },
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
    totalPages: Math.ceil(total / limit),
  };
}

async findByCotisation(
  idcotisation: number,
  page = 1,
  limit = 10,
  statut?: string, // nouveau paramètre pour filtrer par statut
) {
  const skip = (page - 1) * limit;

  // Construire le filtre
  const where: any = { idcotisation };
  if (statut) {
    where.statut = statut;
  }

  const [data, total] = await Promise.all([
    this.prisma.paiement.findMany({
      where,
      include: { membre: { include: { personne: true } } },
      orderBy: { createat: 'desc' },
      skip,
      take: limit,
    }),
    this.prisma.paiement.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

}