import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegenerationService {
  constructor(private prisma: PrismaService) {}

  // Générer un nouveau code de récupération
  private generateRecoveryCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code.match(/.{1,4}/g)?.join('-') ?? code;
  }

  async regenerateRecoveryCode(telephone: string, mot_de_passe: string, deviceid: string) {
    // 1. Vérifier que la session active existe avec le deviceid fourni
    const session = await this.prisma.session.findFirst({
      where: {
        telephone,
        deviceid,
        statutsession: 'active',
      },
    });

    if (!session) {
      throw new UnauthorizedException('Aucune session active trouvée pour ce téléphone et device');
    }

    // 2. Vérifier la connexion et le mot de passe
    const connexion = await this.prisma.connexion.findFirst({ where: { telephone } });
    if (!connexion) {
      throw new UnauthorizedException('Téléphone invalide');
    }

    const passwordMatch = await bcrypt.compare(mot_de_passe, connexion.mot_de_passe);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    // 3. Générer un nouveau code de récupération
    const newCode = this.generateRecoveryCode();

    // 4. Mettre à jour le code dans la table connexion
    await this.prisma.connexion.update({
      where: { connexionid: connexion.connexionid },
      data: {
        coderecup: newCode,
        updateat: new Date(),
      },
    });

    return {
      message: 'Nouveau code de récupération généré avec succès',
      coderecup: newCode,
    };
  }
}
