import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateConnexionDto } from './dto/create-connexion.dto';
import { UpdateConnexionDto } from './dto/update-connexion.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConnexionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateConnexionDto) {
    const { idpersonne, ...rest } = data;

    return this.prisma.connexion.create({
      data: {
        ...rest,
        personne: idpersonne ? { connect: { idpersonne } } : undefined,
      } as Prisma.connexionCreateInput,
    });
  }

  findAll() {
    return this.prisma.connexion.findMany({
      include: { personne: true },
    });
  }

  async findOne(id: number) {
    const connexion = await this.prisma.connexion.findUnique({
      where: { connexionid: id },
      include: { personne: true },
    });

    if (!connexion) {
      throw new NotFoundException(`Connexion avec l'ID ${id} introuvable`);
    }

    return connexion;
  }

  async update(id: number, data: UpdateConnexionDto) {
    await this.findOne(id);

    const { idpersonne, ...rest } = data;

    return this.prisma.connexion.update({
      where: { connexionid: id },
      data: {
        ...rest,
        personne: idpersonne ? { connect: { idpersonne } } : undefined,
      } as Prisma.connexionUpdateInput,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.connexion.delete({
      where: { connexionid: id },
    });
  }




   async getRecoveryCodeByMembreId(idmembre: number): Promise<{ coderecup: string | null }> {
    // Récupère l'idpersonne lié au membre
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre },
      select: { idpersonne: true },
    });

    if (!membre) {
      throw new NotFoundException(`Membre avec id ${idmembre} introuvable`);
    }

    // Cherche la connexion correspondant à cette personne (la plus récente)
    const connexion = await this.prisma.connexion.findFirst({
      where: { idpersonne: membre.idpersonne },
      orderBy: { updateat: 'desc' },
      select: { coderecup: true },
    });

    return { coderecup: connexion?.coderecup ?? null };
  }
}
