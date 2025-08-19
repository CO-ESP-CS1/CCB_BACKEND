import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { statut_membre_enum, statut_connexion_enum } from '@prisma/client';

@Injectable()
export class MembreConnexionService {
  constructor(private readonly prisma: PrismaService) {}

  private async getMembreWithRelations(idmembre: number) {
    const membre = await this.prisma.membre.findUnique({
      where: { idmembre },
      include: {
        personne: {
          include: {
            connexion: true
          }
        }
      }
    });

    if (!membre) {
      throw new NotFoundException(`Membre avec l'ID ${idmembre} introuvable`);
    }

    if (!membre.personne?.connexion) {
      throw new NotFoundException(`Connexion pour le membre ${idmembre} introuvable`);
    }

    return membre;
  }

  async updateStatus(idmembre: number, action: 'valider' | 'refuser' | 'suspendre') {
    const membre = await this.getMembreWithRelations(idmembre);
    const idconnexion = membre.personne.connexion[0]?.connexionid;

    // Définir les nouveaux statuts selon l'action
    let nouveauStatutMembre: statut_membre_enum;
    let nouveauStatutConnexion: statut_connexion_enum;

    switch (action) {
      case 'valider':
        nouveauStatutMembre = 'actif';
        nouveauStatutConnexion = 'active';
        break;
      case 'refuser':
        nouveauStatutMembre = 'inactif';
        nouveauStatutConnexion = 'annule';
        break;
      case 'suspendre':
        nouveauStatutMembre = 'suspendu';
        nouveauStatutConnexion = 'desactive';
        break;
      default:
        throw new Error('Action non reconnue');
    }

    // Mettre à jour dans une transaction
    return this.prisma.$transaction([
      this.prisma.membre.update({
        where: { idmembre },
        data: { statutmembre: nouveauStatutMembre }
      }),
      this.prisma.connexion.update({
        where: { connexionid: idconnexion },
        data: { statutconnexion: nouveauStatutConnexion }
      })
    ]);
  }


  async hasPendingMembers(): Promise<boolean> {
    const count = await this.prisma.membre.count({
      where: {
        AND: [
          { statutmembre: 'inactif' },
          {
            personne: {
              connexion: {
                some: {
                  statutconnexion: 'en_attente'
                }
              }
            }
          }
        ]
      }
    });

    return count > 0;
  }
}