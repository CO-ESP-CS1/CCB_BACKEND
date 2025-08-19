import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActiviteAssembleeDto } from './dto/create-activite-assemblee.dto';

@Injectable()
export class ActiviteAssembleeService {
  constructor(private readonly prisma: PrismaService) {}

  async createActiviteAssemblees(createDto: CreateActiviteAssembleeDto) {
    try {
      const { idactivite, idassemblees } = createDto;

      // Création des relations dans la table activite_assemblee
      const activiteAssemblees = idassemblees.map((idassemblee) => ({
        idactivite,
        idassemblee,
        dateprevue: new Date(),  // Date prévue par défaut, ou on peut accepter la date via le DTO si nécessaire
      }));

      // On utilise la méthode `createMany` de Prisma pour insérer plusieurs lignes
      const result = await this.prisma.activite_assemblee.createMany({
        data: activiteAssemblees,
      });

      return result;
    } catch (error) {
      console.error('Erreur lors de la création des activités et assemblées :', error);
      throw new InternalServerErrorException('Impossible de lier l\'activité aux assemblées');
    }
  }
}
