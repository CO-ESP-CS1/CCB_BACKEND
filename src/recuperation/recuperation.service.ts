import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { statut_code_recuperation } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Générer un code OTP alphanumérique de 6 caractères (modifiable)
  private generateOtp(length = 6): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  }

  /**
   * Démarrer la récupération d'accès avec téléphone, mot de passe, code de récupération
   */
  async startRecovery(telephone: string, mot_de_passe: string, coderecup: string, deviceid?: string) {
    // 1. Trouver la connexion associée au téléphone
    const connexion = await this.prisma.connexion.findFirst({
      where: { telephone },
    });

    if (!connexion) {
      throw new UnauthorizedException('Téléphone ou mot de passe invalide');
    }

    // 2. Vérifier le mot de passe
    if (!connexion.mot_de_passe) {
      throw new UnauthorizedException('Mot de passe non défini pour ce compte');
    }

    const passwordMatch = await bcrypt.compare(mot_de_passe, connexion.mot_de_passe);
    if (!passwordMatch) {
      throw new UnauthorizedException('Téléphone ou mot de passe invalide');
    }

    // 3. Vérifier le code de récupération
    if (connexion.coderecup !== coderecup) {
      throw new UnauthorizedException('Code de récupération invalide');
    }

    // 4. Générer le code OTP
    const codeotp = this.generateOtp(6);

    // 5. Calculer les dates de validité (10 minutes)
    const now = new Date();
    const expirele = new Date(now.getTime() + 10 * 60 * 1000); // +10 minutes

    // 6. Enregistrer dans coderecuperation
    const codeRecuperationEntry = await this.prisma.coderecuperation.create({
      data: {
        telephone,
        codeotp,
        deviceid: deviceid ?? null,
        coderecup,
        datedebutvalidite: now,
        expirele,
        estutilise: false,
        statut: 'en_attente', // adapte selon ton enum 'statut_code_recuperation'
        connexionid: connexion.connexionid!,
      },
    });

    // 7. Retourner le code OTP (ou un token temporaire, selon besoin)
    return {
      message: 'Code OTP généré. Vous avez 10 minutes pour l’utiliser.',
      codeotp,
      expirele,
      idcoderecuperation: codeRecuperationEntry.idcoderecuperation,
    };
  }




 async verifyOtp(telephone: string, codeotp: string, deviceid?: string) {
  // 1. Trouver le code de récupération actif correspondant
  const codeRecup = await this.prisma.coderecuperation.findFirst({
    where: {
      telephone,
      codeotp,
      statut: 'en_attente',
    },
    orderBy: { datedebutvalidite: 'desc' }, // prendre le plus récent
  });

  if (!codeRecup) {
    throw new UnauthorizedException('Code OTP invalide ou non disponible');
  }

  // 2. Vérifier que le deviceid correspond à celui qui a initié la récupération
  if (codeRecup.deviceid && deviceid !== codeRecup.deviceid) {
    throw new UnauthorizedException('Cet appareil n’est pas autorisé pour ce code OTP');
  }

  const now = new Date();

  // 3. Vérifier la validité temporelle
  if (codeRecup.expirele && codeRecup.expirele < now) {
    // Marquer comme expiré (optionnel)
    await this.prisma.coderecuperation.update({
      where: { idcoderecuperation: codeRecup.idcoderecuperation },
      data: { statut: 'expire' },
    });
    throw new UnauthorizedException('Le code OTP a expiré');
  }

  if (codeRecup.estutilise) {
    throw new UnauthorizedException('Le code OTP a déjà été utilisé');
  }

  // 4. Mettre à jour le statut du code à "utilise"
  await this.prisma.coderecuperation.update({
    where: { idcoderecuperation: codeRecup.idcoderecuperation },
    data: { statut: 'utilise', estutilise: true, updateat: new Date() },
  });

  // 5. Mettre à jour la session pour cet utilisateur
  const session = await this.prisma.session.findFirst({
    where: {
      telephone,
      statutsession: 'active',
    },
    orderBy: { updateat: 'desc' },
  });

  if (session) {
    await this.prisma.session.update({
      where: { idsession: session.idsession },
      data: {
        deviceid: deviceid ?? session.deviceid,
        updateat: new Date(),
      },
    });
  } else {
    // Optionnel: créer une session ou lancer une erreur
  }

  return { message: 'Code OTP validé avec succès' };
}


async forgotPassword(telephone: string, coderecup: string, deviceid: string) {
  // 1. Vérifier qu'il existe une session active avec ce telephone ET ce deviceid
  const session = await this.prisma.session.findFirst({
    where: {
      telephone,
      deviceid,
      statutsession: 'active',
    },
  });

  if (!session) {
    throw new UnauthorizedException('Aucune session active trouvée pour cet appareil.');
  }

  // 2. Vérifier que le code de récupération correspond à ce téléphone (on ne vérifie pas ici le deviceid dans coderecuperation car on se base sur la session)
  const connexion = await this.prisma.connexion.findFirst({
    where: { telephone },
  });

  if (!connexion || connexion.coderecup !== coderecup) {
    throw new UnauthorizedException('Code de récupération invalide.');
  }

  // 3. Générer un code OTP
  const codeotp = this.generateOtp(6);

  const now = new Date();
  const expirele = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

  // 4. Enregistrer dans coderecuperation
  const codeRecuperationEntry = await this.prisma.coderecuperation.create({
    data: {
      telephone,
      codeotp,
      deviceid,
      coderecup,
      datedebutvalidite: now,
      expirele,
      estutilise: false,
      statut: 'en_attente',
      connexionid: connexion.connexionid!,
    },
  });

  return {
    message: 'Code OTP généré pour réinitialisation du mot de passe. Vous avez 10 minutes pour l’utiliser.',
    codeotp,
    expirele,
    idcoderecuperation: codeRecuperationEntry.idcoderecuperation,
  };
}


async verifyOtpAndResetPassword(
  telephone: string,
  deviceid: string,
  codeotp: string,
  nouveauMotDePasse: string,
) {
  // Trouver le code de récupération actif correspondant
  const codeRecup = await this.prisma.coderecuperation.findFirst({
    where: {
      telephone,
      codeotp,
      statut: 'en_attente',
      deviceid,
    },
    orderBy: { datedebutvalidite: 'desc' },
  });

  if (!codeRecup) {
    throw new UnauthorizedException('Code OTP invalide ou non disponible pour ce device');
  }

  const now = new Date();

  if (codeRecup.expirele && codeRecup.expirele < now) {
    await this.prisma.coderecuperation.update({
      where: { idcoderecuperation: codeRecup.idcoderecuperation },
      data: { statut: 'expire' },
    });
    throw new UnauthorizedException('Le code OTP a expiré');
  }

  if (codeRecup.estutilise) {
    throw new UnauthorizedException('Le code OTP a déjà été utilisé');
  }

  // Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(nouveauMotDePasse, 10);

  // Mettre à jour le mot de passe dans la connexion
  await this.prisma.connexion.update({
    where: { connexionid: codeRecup.connexionid },
    data: { mot_de_passe: hashedPassword },
  });

  // Marquer le code OTP comme utilisé
  await this.prisma.coderecuperation.update({
    where: { idcoderecuperation: codeRecup.idcoderecuperation },
    data: { statut: 'utilise', estutilise: true, updateat: new Date() },
  });

  return { message: 'Mot de passe mis à jour avec succès' };
}


 async forgotPasswordDifferentDevice(telephone: string, coderecup: string, deviceid: string) {
    // 1. Vérifier la connexion par téléphone
    const connexion = await this.prisma.connexion.findFirst({
      where: { telephone },
    });

    if (!connexion) {
      throw new UnauthorizedException('Téléphone non trouvé');
    }

    // 2. Vérifier le code de récupération
    if (connexion.coderecup !== coderecup) {
      throw new UnauthorizedException('Code de récupération invalide');
    }

    // 3. Générer un code OTP
    const codeotp = this.generateOtp(6);

    // 4. Dates validité : 10 minutes
    const now = new Date();
    const expirele = new Date(now.getTime() + 10 * 60 * 1000);

    // 5. Créer une entrée dans coderecuperation avec le deviceid nouveau
    const codeRecuperationEntry = await this.prisma.coderecuperation.create({
      data: {
        telephone,
        codeotp,
        deviceid,
        coderecup,
        datedebutvalidite: now,
        expirele,
        estutilise: false,
        statut: 'en_attente',
        connexionid: connexion.connexionid!,
      },
    });

    // 6. Retourner le code OTP + infos
    return {
      message: 'Code OTP généré pour nouveau device, valable 10 minutes.',
      codeotp,
      expirele,
      idcoderecuperation: codeRecuperationEntry.idcoderecuperation,
    };
  }


   async verifyOtpResetPasswordDifferentDevice(
  telephone: string,
  deviceid: string,
  codeotp: string,
  nouveau_mot_de_passe: string,
) {
  const now = new Date();

  // 1. Récupérer le code de récupération correspondant au tel, otp, deviceid, statut en_attente, trié par date la plus récente
  const codeRecup = await this.prisma.coderecuperation.findFirst({
    where: {
      telephone,
      codeotp,
      deviceid,
      statut: 'en_attente',
    },
    orderBy: { datedebutvalidite: 'desc' },
  });

  if (!codeRecup) {
    throw new UnauthorizedException('Code OTP invalide ou device non reconnu');
  }

  // 2. Vérifier que le code n’est pas expiré
  if (codeRecup.expirele && codeRecup.expirele < now) {
    await this.prisma.coderecuperation.update({
      where: { idcoderecuperation: codeRecup.idcoderecuperation },
      data: { statut: 'expire' },
    });
    throw new UnauthorizedException('Le code OTP a expiré');
  }

  // 3. Vérifier que le code n’a pas été utilisé
  if (codeRecup.estutilise) {
    throw new UnauthorizedException('Le code OTP a déjà été utilisé');
  }

  // 4. Mettre à jour le statut du code OTP en "utilise"
  await this.prisma.coderecuperation.update({
    where: { idcoderecuperation: codeRecup.idcoderecuperation },
    data: { statut: 'utilise', estutilise: true, updateat: now },
  });

  // 5. Hasher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);

  // 6. Mettre à jour le mot de passe dans la table connexion
  await this.prisma.connexion.update({
    where: { connexionid: codeRecup.connexionid },
    data: {
      mot_de_passe: hashedPassword,
      updateat: now,
    },
  });

  // 7. Mettre à jour la session avec le nouveau deviceid (sans créer de session nouvelle)
  const session = await this.prisma.session.findFirst({
    where: {
      telephone,
      statutsession: 'active',
    },
    orderBy: { updateat: 'desc' },
  });

  if (session) {
    await this.prisma.session.update({
      where: { idsession: session.idsession },
      data: {
        deviceid,
        updateat: now,
      },
    });
  } else {
    throw new UnauthorizedException('Aucune session active trouvée pour ce téléphone.');
  }

  return { message: 'Mot de passe mis à jour avec succès et device associé.' };
}

}
