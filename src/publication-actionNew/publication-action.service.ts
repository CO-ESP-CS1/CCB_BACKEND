import { 
  Injectable, 
  ForbiddenException, 
  ConflictException, 
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublicationActionNewDto } from './dto/create-publication-action.dto';
import { publication_action_enum, statut_publication_enum } from '@prisma/client';

@Injectable()
export class PublicationActionService {
  constructor(private prisma: PrismaService) {}

  private async checkManagerBadge(idmembre: number): Promise<void> {
    // Vérification que l'utilisateur a le badge "manager"
    const managerBadge = await this.prisma.badge.findFirst({
      where: { nombadge: 'manager' }
    });

    if (!managerBadge) {
      throw new ForbiddenException('Le badge "manager" n\'existe pas dans le système');
    }

    const hasManagerBadge = await this.prisma.membre_badge.findFirst({
      where: {
        idmembre: idmembre,
        idbadge: managerBadge.idbadge
      }
    });

    if (!hasManagerBadge) {
      throw new ForbiddenException('Seuls les membres avec le badge "manager" peuvent effectuer cette action');
    }
  }

  async createPublicationAction(dto: CreatePublicationActionNewDto, idmembre: number) {
    // Vérification des actions nécessitant un motif
    if ((dto.action === 'rejete' || dto.action === 'signale') && !dto.motif) {
      throw new ForbiddenException('Un motif est obligatoire pour cette action');
    }

    // Vérification du badge manager
    await this.checkManagerBadge(idmembre);

    // Récupération de la publication
    const publication = await this.prisma.publication.findUnique({
      where: { idpublication: dto.idpublication },
      include: { membre: true }
    });

    if (!publication) {
      throw new NotFoundException('Publication introuvable');
    }

    // Vérification des transitions d'état valides
    const validTransitions: Partial<Record<statut_publication_enum, publication_action_enum[]>> = {
      brouillon: ['valide', 'rejete', 'en_attente'],
      en_attente: ['valide', 'rejete'],
      publie: ['archive', 'signale'],
      archive: [],
      expire: [],
      desactive: []
    };

    const currentStatus = publication.statutpublication as keyof typeof validTransitions;
    
    if (!currentStatus) {
      throw new InternalServerErrorException('Le statut de la publication est invalide');
    }

    const allowedActions = validTransitions[currentStatus] || [];
    if (!allowedActions.includes(dto.action)) {
      throw new ConflictException(
        `Action "${dto.action}" non permise pour une publication au statut "${publication.statutpublication}"`
      );
    }

    // Création de l'action dans une transaction
    return this.prisma.$transaction(async (prisma) => {
      const action = await prisma.publication_action.create({
        data: {
          action: dto.action,
          motif: dto.motif,
          idpublication: dto.idpublication,
          idmembre: idmembre
        }
      });

      const statusMap: Record<publication_action_enum, statut_publication_enum | null> = {
        valide: 'publie',
        rejete: 'desactive',
        archive: 'archive',
        signale: null,
        modifie: null,
        en_attente: 'en_attente'
      };

      const newStatus = statusMap[dto.action];
      if (newStatus) {
        await prisma.publication.update({
          where: { idpublication: dto.idpublication },
          data: { statutpublication: newStatus }
        });
      }

      // Mise à jour des soldes des membres
      if (dto.action === 'valide') {
        await prisma.membre.update({
          where: { idmembre: idmembre },
          data: { solde: { increment: 15 } }
        });

        await prisma.membre.update({
          where: { idmembre: publication.idmembre },
          data: { solde: { increment: 10 } }
        });
      } else if (dto.action === 'rejete') {
        await prisma.membre.update({
          where: { idmembre: idmembre },
          data: { solde: { increment: 5 } }
        });

        const owner = await prisma.membre.findUnique({
          where: { idmembre: publication.idmembre }
        });

        if (!owner) {
          throw new NotFoundException('Propriétaire de la publication introuvable');
        }

        const currentBalance = owner.solde ? Number(owner.solde) : 0;
        const newBalance = Math.max(0, currentBalance - 5);
        
        await prisma.membre.update({
          where: { idmembre: publication.idmembre },
          data: { solde: newBalance }
        });
      }

      return action;
    });
  }
}