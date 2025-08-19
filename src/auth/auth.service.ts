import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/RegisterDto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Génère un code de récupération à 12 caractères, format XXXX-XXXX-XXXX
  private generateRecoveryCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Sépare en groupes de 4 avec des tirets
    return code.match(/.{1,4}/g)?.join('-') ?? code;
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(dto: RegisterDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // 1. Vérifier si le téléphone est déjà utilisé
        const existingUser = await prisma.connexion.findFirst({
          where: { telephone: dto.telephone },
        });

        if (existingUser) {
          throw new BadRequestException('Ce numéro de téléphone est déjà enregistré');
        }

        // 2. Vérifier si l'email existe déjà, uniquement si fourni
        if (dto.email) {
          const emailExists = await prisma.personne.findFirst({
            where: { email: dto.email },
          });

          if (emailExists) {
            throw new BadRequestException('Cet email est déjà utilisé');
          }
        }

        // 3. Créer la personne
        const personne = await prisma.personne.create({
          data: {
            nom: dto.nom,
            prenom: dto.prenom,
            telephone: dto.telephone,
            email: dto.email ?? null,
            sexe: dto.sexe,
            datenaissance: new Date(dto.datenaissance),
          },
        });

        // 4. Créer la connexion
        const hashedPassword = await bcrypt.hash(dto.mot_de_passe, 10);
        const recoveryCode = this.generateRecoveryCode();

        const connexion = await prisma.connexion.create({
          data: {
            telephone: dto.telephone,
            mot_de_passe: hashedPassword,
            statutconnexion: 'en_attente',
            coderecup: recoveryCode,
            idpersonne: personne.idpersonne!,
          },
        });

        // 5. Créer le membre
        const membre = await prisma.membre.create({
          data: {
            codemembre: `MBR-${new Date()
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, '')}-${personne.idpersonne}`,
            solde: 0,
            dateadhesion: new Date(),
            statutmembre: 'inactif',
            idassemblee: dto.idassemblee ?? 1,
            idpersonne: personne.idpersonne!,
          },
        });

        // 6. Créer la session
        const session = await prisma.session.create({
          data: {
            telephone: dto.telephone,
            statutsession: 'active',
            connexionid: connexion.connexionid!,
            deviceid: dto.deviceid ?? null,
            useragent: dto.useragent ?? null,
            ipadresse: dto.ipadresse ?? null,
          },
        });

        return {
          message: 'Inscription réussie. Votre compte est en attente d’activation.',
          data: {
            personne: {
              id: personne.idpersonne,
              nom: personne.nom,
              prenom: personne.prenom,
            },
            membre: {
              code: membre.codemembre,
              statut: membre.statutmembre,
            },
            session: {
              id: session.idsession,
              statut: session.statutsession,
            },
            coderecup: recoveryCode,
          },
        };
      });
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de l’inscription. Veuillez réessayer plus tard.');
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(
    telephone: string,
    mot_de_passe: string,
    deviceid: string,
    useragent?: string,
    ipadresse?: string,
  ) {
    try {
      // 1. Vérifier la connexion avec inclusion de la personne
      const connexion = await this.prisma.connexion.findFirst({
        where: { telephone },
        include: { personne: true },
      });

      if (!connexion) {
        throw new UnauthorizedException('Téléphone ou mot de passe invalide');
      }

      if (!connexion.mot_de_passe) {
        throw new UnauthorizedException('Mot de passe non défini pour ce compte');
      }

      // 2. Vérifier le mot de passe
      if (!mot_de_passe || !connexion.mot_de_passe) {
        throw new UnauthorizedException('Mot de passe ou données manquantes');
      }

      const passwordMatch = await bcrypt.compare(mot_de_passe, connexion.mot_de_passe);
      if (!passwordMatch) {
        throw new UnauthorizedException('Téléphone ou mot de passe invalide');
      }

      // 3. Vérifier le statut de la connexion
      if (connexion.statutconnexion !== 'active') {
        throw new UnauthorizedException(
          `Votre connexion est actuellement "${connexion.statutconnexion}". Merci de contacter le support.`,
        );
      }

      // 4. Vérifier la session active sur ce device
      let session = await this.prisma.session.findFirst({
        where: {
          telephone,
          deviceid,
          statutsession: 'active',
        },
      });

      if (!session) {
        const oldSession = await this.prisma.session.findFirst({
          where: {
            telephone,
            deviceid,
            statutsession: 'deconnecte',
          },
        });

        if (oldSession) {
          session = await this.prisma.session.update({
            where: { idsession: oldSession.idsession },
            data: { statutsession: 'active' },
          });
        } else {
          throw new UnauthorizedException(
            'Aucune session active trouvée pour cet appareil. Veuillez vérifier votre appareil ou reconnecter.',
          );
        }
      }

      // 5. Vérifier le membre lié ET inclure la relation personne (déjà en connexion mais pour sécurité)
      const membre = await this.prisma.membre.findFirst({
        where: { idpersonne: connexion.idpersonne! },
        include: { personne: true },
      });

      if (!membre) {
        throw new UnauthorizedException('Aucun membre lié à ce compte. Veuillez contacter le support.');
      }

      if (membre.statutmembre !== 'actif') {
        throw new UnauthorizedException(
          `Votre compte membre est actuellement "${membre.statutmembre}". Merci de contacter le support.`,
        );
      }

      // 6. Enregistrer l’historique de connexion
      await this.prisma.loginhistory.create({
        data: {
          personnelid: connexion.idpersonne!,
          ipadresse,
          useragent,
          logintime: new Date(),
        },
      });

      // 7. Construire le payload complet
      const payload = {
        sub: connexion.idpersonne,
        telephone,
        role: membre.role,

        // Infos membre
        idmembre: membre.idmembre,
        codemembre: membre.codemembre,
        solde: membre.solde,
        dateadhesion: membre.dateadhesion,
        statutmembre: membre.statutmembre,
        idassemblee: membre.idassemblee,

        // Infos personne
        personne: {
          idpersonne: membre.personne.idpersonne,
          nom: membre.personne.nom,
          prenom: membre.personne.prenom,
          email: membre.personne.email,
          telephone: membre.personne.telephone,
          sexe: membre.personne.sexe,
          datenaissance: membre.personne.datenaissance,
        },
      };

      const access_token = this.jwtService.sign(payload, { expiresIn: '30d' });

      // 8. Retourner token + payload complet pour le front
      return {
        message: 'Connexion réussie',
        access_token,
        user: payload,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la connexion. Veuillez réessayer plus tard.');
    }
  }

  async logout(telephone: string, deviceid: string) {
    try {
      // Vérifier que la session existe
      const session = await this.prisma.session.findFirst({
        where: { telephone, deviceid, statutsession: 'active' },
      });

      if (!session) {
        throw new UnauthorizedException('Session introuvable ou déjà déconnectée');
      }

      // Mettre à jour le statut de la session
      await this.prisma.session.update({
        where: { idsession: session.idsession },
        data: {
          statutsession: 'deconnecte', // Enum : active | expire | deconnecte | annule
        },
      });

      return { message: 'Déconnexion réussie' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la déconnexion. Veuillez réessayer plus tard.');
    }
  }
}
