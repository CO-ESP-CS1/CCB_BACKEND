import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ActiviteModule } from './activite/activite.module';
import { ActiviteAssembleeModule } from './activite-assemblee/activite-assemblee.module';
import { AnnonceModule } from './annonce/annonce.module';
import { AnnonceAssembleeModule } from './annonce_assemblee/annonce-assemblee.module';
import { AnnonceDepartementModule } from './annonce_departement/annonce-departement.module';
import { ArrondissementModule } from './arrondissement/arrondissement.module';
import { AssembleeModule } from './assemblee/assemblee.module';
import { AssembleePlanningModule } from './assembleeplanning/assembleeplanning.module';
import { BadgeModule } from './badge/badge.module';
import { CodeRecuperationModule } from './coderecuperation/coderecuperation.module';
import { ConnexionModule } from './connexion/connexion.module';
import { DepartementModule } from './departement/departement.module';
import { DirigeModule } from './dirige/dirige.module';
import { EstModule } from './est/est.module';
import { InscriptionModule } from './inscription/inscription.module';
import { InteractionModule } from './interaction/interaction.module';
import { IntervenantModule } from './intervenant/intervenant.module';
import { LiveModule } from './live/live.module';
import { LoginHistoryModule } from './loginhistory/loginhistory.module';
import { MembreModule } from './membre/membre.module';
import { MembreBadgeModule } from './membre_badge/membre-badge.module';
import { ParticipeModule } from './participe/participe.module';
import { PersonneModule } from './personne/personne.module';
import { PaysModule } from './pays/pays.module';
import { PlanningModule } from './planning/planning.module';
import { ProfilassembleeModule } from './profilassemblee/profilassemblee.module';
import { ProfilDepartementModule } from './profiledepartement/profildepartement.module';
import { ProfilPersonneModule } from './profilpersonne/profilpersonne.module';
import { PublicationModule } from './publication/publication.module';
import { PublicationActionModule } from './publication-action/publication-action.module';
import { ResponsabiliteModule } from './responsabilite/responsabilite.module';
import { SeanceModule } from './seance/seance.module';
import { SessionModule } from './session/session.module';
import { TypeactivitesModule } from './typeactivites/typeactivites.module';
import { TypeannonceModule } from './typeannonce/typeannonce.module';
import { TyperesponsabiliteModule } from './typeresponsabilite/typeresponsabilite.module';
import { VilleModule } from './ville/ville.module';
import { AuthModule } from './auth/auth.module';
import { RecuperationModule } from './recuperation/recuperation.module';
import { RegenerationModule } from './regeneration/regeneration.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MembreModulePersonne } from './membrePersonne/membre.module';
import { PublicationNewModule } from './publicationNew/publication.module';
import { LiveNewModule } from './liveNew/live.module';
import { ActiviteNewModule } from './activiteNew/activite.module';
import { ActiviteAssembleeModuleNew } from './activite-assembleeNew/activite-assemblee.module';
import { AnnonceNewModule } from './annonceNew/annonceNew.module';
import { InteractionNewModule } from './interactionNew/interaction.module';
import { PublicationActionNewModule } from './publication-actionNew/publication-action.module';
import { ParticipationModule } from './participation/participation.module';
import { MembreBadgeNewModule } from './MembreBadge/membre-badge.module';
import { ProfilModule } from './profil/profil.module';
import { MembreConnexionModule } from './membre-connexion/membre-connexion.module';
import { BadgeNewModule } from './memberHasBadge/badge.module';
import { DepartmentMembershipModule } from './department-membership/department-membership.module';
import { ConsultationAnnonceModule } from './consultation-annonce/consultation-annonce.module';
import { CotisationModule } from './cotisation/cotisation.module';
import { PaiementModule } from './paiement/paiement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      
    }),
    PrismaModule, ActiviteModule, ActiviteAssembleeModule, AnnonceModule, AnnonceAssembleeModule, AnnonceDepartementModule, ArrondissementModule, AssembleeModule, AssembleePlanningModule, BadgeModule, CodeRecuperationModule, ConnexionModule, DepartementModule, DirigeModule, EstModule, InscriptionModule, InteractionModule, IntervenantModule, LiveModule, LoginHistoryModule, MembreModule, MembreBadgeModule, ParticipeModule, PersonneModule, PaysModule, PlanningModule, ProfilassembleeModule, ProfilDepartementModule, ProfilPersonneModule, PublicationModule, PublicationActionModule, ResponsabiliteModule, SeanceModule, SessionModule, TypeactivitesModule, TypeannonceModule, TyperesponsabiliteModule, VilleModule, AuthModule, RecuperationModule, RegenerationModule, DashboardModule, MembreModulePersonne, PublicationNewModule, LiveNewModule, ActiviteNewModule, ActiviteAssembleeModuleNew, AnnonceNewModule, InteractionNewModule, PublicationActionNewModule, ParticipationModule, MembreBadgeNewModule, ProfilModule, MembreConnexionModule, BadgeNewModule, DepartmentMembershipModule, ConsultationAnnonceModule, CotisationModule, PaiementModule
  ],
})
export class AppModule {}
