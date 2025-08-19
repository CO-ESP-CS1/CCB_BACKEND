-- CreateEnum
CREATE TYPE "public"."etat_planning_enum" AS ENUM ('en_attente', 'en_cours', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "public"."interaction_type_enum" AS ENUM ('like', 'commentaire', 'partage', 'reaction', 'vote', 'signale', 'vue');

-- CreateEnum
CREATE TYPE "public"."priorite_annonce_enum" AS ENUM ('haute', 'normale', 'basse', 'urgent');

-- CreateEnum
CREATE TYPE "public"."publication_action_enum" AS ENUM ('valide', 'rejete', 'archive', 'signale', 'modifie', 'en_attente');

-- CreateEnum
CREATE TYPE "public"."statut_activite_enum" AS ENUM ('planifie', 'en_cours', 'termine', 'annule', 'desactive');

-- CreateEnum
CREATE TYPE "public"."statut_annonce_enum" AS ENUM ('brouillon', 'publie', 'archive');

-- CreateEnum
CREATE TYPE "public"."statut_code_recuperation" AS ENUM ('en_attente', 'utilise', 'expire');

-- CreateEnum
CREATE TYPE "public"."statut_connexion_enum" AS ENUM ('annule', 'desactive', 'verrouille', 'en_attente', 'active');

-- CreateEnum
CREATE TYPE "public"."statut_inscription_enum" AS ENUM ('en_attente', 'confirme', 'annule', 'termine');

-- CreateEnum
CREATE TYPE "public"."statut_live_enum" AS ENUM ('programme', 'en_cours', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "public"."statut_membre_enum" AS ENUM ('actif', 'inactif', 'suspendu', 'radie');

-- CreateEnum
CREATE TYPE "public"."statut_planning_enum" AS ENUM ('actif', 'inactif', 'archive');

-- CreateEnum
CREATE TYPE "public"."statut_publication_enum" AS ENUM ('brouillon', 'publie', 'expire', 'archive', 'desactive', 'en_attente');

-- CreateEnum
CREATE TYPE "public"."statut_responsabilite_enum" AS ENUM ('actif', 'inactif', 'archive');

-- CreateEnum
CREATE TYPE "public"."statut_seance_enum" AS ENUM ('planifie', 'en_cours', 'termine', 'annule');

-- CreateEnum
CREATE TYPE "public"."statut_session_enum" AS ENUM ('active', 'expire', 'deconnecte', 'annule');

-- CreateTable
CREATE TABLE "public"."activite" (
    "idactivite" SERIAL NOT NULL,
    "libelleactivite" VARCHAR(100),
    "descriptionactivite" TEXT,
    "datedebut" DATE,
    "datefin" DATE,
    "imageurl" TEXT,
    "statutactivite" VARCHAR(50),
    "idtypeactivites" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activite_pkey" PRIMARY KEY ("idactivite")
);

-- CreateTable
CREATE TABLE "public"."activite_assemblee" (
    "idactivite" INTEGER NOT NULL,
    "idassemblee" INTEGER NOT NULL,
    "dateprevue" DATE,

    CONSTRAINT "activite_assemblee_pkey" PRIMARY KEY ("idactivite","idassemblee")
);

-- CreateTable
CREATE TABLE "public"."annonce" (
    "idannonce" SERIAL NOT NULL,
    "titreannonce" VARCHAR(255),
    "descriptionannonce" TEXT,
    "imageurl" TEXT,
    "datepublication" DATE,
    "priorite" "public"."priorite_annonce_enum",
    "statutannonce" "public"."statut_annonce_enum",
    "idmembre" INTEGER NOT NULL,
    "idtypeannonce" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annonce_pkey" PRIMARY KEY ("idannonce")
);

-- CreateTable
CREATE TABLE "public"."annonce_assemblee" (
    "idannonce" INTEGER NOT NULL,
    "idassemblee" INTEGER NOT NULL,
    "datepublication" TIMESTAMP(6),

    CONSTRAINT "annonce_assemblee_pkey" PRIMARY KEY ("idannonce","idassemblee")
);

-- CreateTable
CREATE TABLE "public"."annonce_departement" (
    "idannonce" INTEGER NOT NULL,
    "iddepartement" INTEGER NOT NULL,
    "dateciblage" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annonce_departement_pkey" PRIMARY KEY ("idannonce","iddepartement")
);

-- CreateTable
CREATE TABLE "public"."arrondissement" (
    "idarrondissement" SERIAL NOT NULL,
    "nomarrondissement" VARCHAR(100),
    "idville" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arrondissement_pkey" PRIMARY KEY ("idarrondissement")
);

-- CreateTable
CREATE TABLE "public"."assemblee" (
    "idassemblee" SERIAL NOT NULL,
    "nomassemble" VARCHAR(100),
    "adresseassemblee" TEXT,
    "zone" VARCHAR(100),
    "idarrondissement" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assemblee_pkey" PRIMARY KEY ("idassemblee")
);

-- CreateTable
CREATE TABLE "public"."assembleeplanning" (
    "idassemblee" INTEGER NOT NULL,
    "idplanning" INTEGER NOT NULL,

    CONSTRAINT "assembleeplanning_pkey" PRIMARY KEY ("idassemblee","idplanning")
);

-- CreateTable
CREATE TABLE "public"."badge" (
    "idbadge" SERIAL NOT NULL,
    "nombadge" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "iconeurl" TEXT,
    "couleur" VARCHAR(20),
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_pkey" PRIMARY KEY ("idbadge")
);

-- CreateTable
CREATE TABLE "public"."coderecuperation" (
    "idcoderecuperation" SERIAL NOT NULL,
    "telephone" VARCHAR(20),
    "codeotp" VARCHAR(10),
    "deviceid" TEXT,
    "coderecup" TEXT,
    "datedebutvalidite" TIMESTAMP(6),
    "expirele" TIMESTAMP(6),
    "estutilise" BOOLEAN,
    "statut" "public"."statut_code_recuperation",
    "connexionid" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coderecuperation_pkey" PRIMARY KEY ("idcoderecuperation")
);

-- CreateTable
CREATE TABLE "public"."connexion" (
    "connexionid" SERIAL NOT NULL,
    "telephone" VARCHAR(20),
    "mot_de_passe" VARCHAR(70),
    "coderecup" TEXT,
    "statutconnexion" "public"."statut_connexion_enum",
    "idpersonne" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connexion_pkey" PRIMARY KEY ("connexionid")
);

-- CreateTable
CREATE TABLE "public"."departement" (
    "iddepartement" SERIAL NOT NULL,
    "nomdepartement" VARCHAR(100),
    "responsable" VARCHAR(50),
    "idassemblee" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departement_pkey" PRIMARY KEY ("iddepartement")
);

-- CreateTable
CREATE TABLE "public"."dirige" (
    "idmembre" INTEGER NOT NULL,
    "iddepartement" INTEGER NOT NULL,
    "datedebut" DATE,

    CONSTRAINT "dirige_pkey" PRIMARY KEY ("idmembre","iddepartement")
);

-- CreateTable
CREATE TABLE "public"."est" (
    "idmembre" INTEGER NOT NULL,
    "iddepartement" INTEGER NOT NULL,
    "dateattribution" DATE,

    CONSTRAINT "est_pkey" PRIMARY KEY ("idmembre","iddepartement")
);

-- CreateTable
CREATE TABLE "public"."inscription" (
    "idinscription" SERIAL NOT NULL,
    "statut" "public"."statut_inscription_enum",
    "idmembre" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscription_pkey" PRIMARY KEY ("idinscription")
);

-- CreateTable
CREATE TABLE "public"."interaction" (
    "idinteraction" SERIAL NOT NULL,
    "type" "public"."interaction_type_enum",
    "ressourcetype" VARCHAR(100),
    "ressourceid" INTEGER,
    "contenu" TEXT,
    "idmembre" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interaction_pkey" PRIMARY KEY ("idinteraction")
);

-- CreateTable
CREATE TABLE "public"."intervenant" (
    "idintervenant" SERIAL NOT NULL,
    "nomintervenant" VARCHAR(100),
    "prenomintervenant" VARCHAR(100),
    "idmembre" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intervenant_pkey" PRIMARY KEY ("idintervenant")
);

-- CreateTable
CREATE TABLE "public"."live" (
    "idlive" SERIAL NOT NULL,
    "videourl" TEXT,
    "statutlive" "public"."statut_live_enum",
    "titrelive" VARCHAR(255),
    "descriptionlive" TEXT,
    "heuredebut" TIME(6),
    "heurefin" TIME(6),
    "idseance" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idmembre" INTEGER NOT NULL,

    CONSTRAINT "live_pkey" PRIMARY KEY ("idlive")
);

-- CreateTable
CREATE TABLE "public"."loginhistory" (
    "idloginhistory" SERIAL NOT NULL,
    "personnelid" INTEGER NOT NULL,
    "ipadresse" TEXT,
    "useragent" TEXT,
    "logintime" TIMESTAMP(6),
    "logouttime" TIMESTAMP(6),
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loginhistory_pkey" PRIMARY KEY ("idloginhistory")
);

-- CreateTable
CREATE TABLE "public"."membre" (
    "idmembre" SERIAL NOT NULL,
    "codemembre" VARCHAR(50),
    "solde" DECIMAL(10,2),
    "dateadhesion" DATE,
    "statutmembre" "public"."statut_membre_enum",
    "idassemblee" INTEGER NOT NULL,
    "idpersonne" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membre_pkey" PRIMARY KEY ("idmembre")
);

-- CreateTable
CREATE TABLE "public"."membre_badge" (
    "idmembre" INTEGER NOT NULL,
    "idbadge" INTEGER NOT NULL,
    "dateattribution" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membre_badge_pkey" PRIMARY KEY ("idmembre","idbadge")
);

-- CreateTable
CREATE TABLE "public"."participe" (
    "idmembre" INTEGER NOT NULL,
    "idseance" INTEGER NOT NULL,

    CONSTRAINT "participe_pkey" PRIMARY KEY ("idmembre","idseance")
);

-- CreateTable
CREATE TABLE "public"."pays" (
    "idpays" SERIAL NOT NULL,
    "nompays" VARCHAR(100),
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pays_pkey" PRIMARY KEY ("idpays")
);

-- CreateTable
CREATE TABLE "public"."personne" (
    "idpersonne" SERIAL NOT NULL,
    "nom" VARCHAR(100),
    "prenom" VARCHAR(100),
    "telephone" VARCHAR(20),
    "email" VARCHAR(100),
    "sexe" VARCHAR(10),
    "datenaissance" DATE,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personne_pkey" PRIMARY KEY ("idpersonne")
);

-- CreateTable
CREATE TABLE "public"."planning" (
    "idplanning" SERIAL NOT NULL,
    "typeplanning" VARCHAR(50),
    "datedebut" DATE,
    "datefin" DATE,
    "etatplanning" "public"."etat_planning_enum",
    "titreplanning" VARCHAR(100),
    "descriptionplanning" TEXT,
    "statutplanning" "public"."statut_planning_enum",
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "planning_pkey" PRIMARY KEY ("idplanning")
);

-- CreateTable
CREATE TABLE "public"."profilassemblee" (
    "idprofilassemblee" SERIAL NOT NULL,
    "description" TEXT,
    "photourl" TEXT,
    "couvertureurl" TEXT,
    "idassemblee" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profilassemblee_pkey" PRIMARY KEY ("idprofilassemblee")
);

-- CreateTable
CREATE TABLE "public"."profildepartement" (
    "idprofildepartement" SERIAL NOT NULL,
    "description" VARCHAR(100),
    "photourl" TEXT,
    "couvertureurl" TEXT,
    "iddepartement" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profildepartement_pkey" PRIMARY KEY ("idprofildepartement")
);

-- CreateTable
CREATE TABLE "public"."profilpersonne" (
    "idprofilpersonne" SERIAL NOT NULL,
    "description" TEXT,
    "adresse" TEXT,
    "photourl" TEXT,
    "couvertureurl" TEXT,
    "idpersonne" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profilpersonne_pkey" PRIMARY KEY ("idprofilpersonne")
);

-- CreateTable
CREATE TABLE "public"."publication" (
    "idpublication" SERIAL NOT NULL,
    "description" TEXT,
    "mediaurl" TEXT,
    "expirationdate" DATE,
    "statutpublication" "public"."statut_publication_enum",
    "idmembre" INTEGER NOT NULL,
    "idtypepublication" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_pkey" PRIMARY KEY ("idpublication")
);

-- CreateTable
CREATE TABLE "public"."publication_action" (
    "idpublicationaction" SERIAL NOT NULL,
    "action" "public"."publication_action_enum",
    "motif" TEXT,
    "idpublication" INTEGER NOT NULL,
    "idmembre" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_action_pkey" PRIMARY KEY ("idpublicationaction")
);

-- CreateTable
CREATE TABLE "public"."responsabilite" (
    "idresponsable" SERIAL NOT NULL,
    "libelle" VARCHAR(100),
    "statutresponsabilite" "public"."statut_responsabilite_enum",
    "idtyperesponsabilite" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responsabilite_pkey" PRIMARY KEY ("idresponsable")
);

-- CreateTable
CREATE TABLE "public"."seance" (
    "idseance" SERIAL NOT NULL,
    "titreseance" VARCHAR(100),
    "descriptionseance" TEXT,
    "heuredebut" TIME(6),
    "heurefin" TIME(6),
    "lieu" VARCHAR(100),
    "statutseance" "public"."statut_seance_enum",
    "idactivite" INTEGER NOT NULL,
    "idplanning" INTEGER NOT NULL,
    "idintervenant" INTEGER,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seance_pkey" PRIMARY KEY ("idseance")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "idsession" SERIAL NOT NULL,
    "telephone" VARCHAR(20),
    "deviceid" TEXT,
    "useragent" TEXT,
    "ipadresse" TEXT,
    "statutsession" "public"."statut_session_enum",
    "connexionid" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_pkey" PRIMARY KEY ("idsession")
);

-- CreateTable
CREATE TABLE "public"."typeactivites" (
    "idtypeactivites" SERIAL NOT NULL,
    "nomtypeactivite" VARCHAR(100),
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typeactivites_pkey" PRIMARY KEY ("idtypeactivites")
);

-- CreateTable
CREATE TABLE "public"."typeannonce" (
    "idtypeannonce" SERIAL NOT NULL,
    "nomtypeannonce" VARCHAR(100),
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typeannonce_pkey" PRIMARY KEY ("idtypeannonce")
);

-- CreateTable
CREATE TABLE "public"."typepublication" (
    "idtypepublication" SERIAL NOT NULL,
    "libelle" VARCHAR(100),
    "descriptiontype" TEXT,
    "esttemporaire" BOOLEAN,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typepublication_pkey" PRIMARY KEY ("idtypepublication")
);

-- CreateTable
CREATE TABLE "public"."typeresponsabilite" (
    "idtyperesponsabilite" SERIAL NOT NULL,
    "libelletyperesponsabilite" VARCHAR(100) NOT NULL,

    CONSTRAINT "typeresponsabilite_pkey" PRIMARY KEY ("idtyperesponsabilite")
);

-- CreateTable
CREATE TABLE "public"."ville" (
    "idville" SERIAL NOT NULL,
    "nomville" VARCHAR(100),
    "idpays" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ville_pkey" PRIMARY KEY ("idville")
);

-- CreateIndex
CREATE INDEX "idx_activite_statut" ON "public"."activite"("statutactivite");

-- CreateIndex
CREATE INDEX "idx_annonce_date_pub" ON "public"."annonce"("datepublication");

-- CreateIndex
CREATE INDEX "idx_annonce_statut" ON "public"."annonce"("statutannonce");

-- CreateIndex
CREATE INDEX "idx_arrondissement_nom" ON "public"."arrondissement"("nomarrondissement");

-- CreateIndex
CREATE UNIQUE INDEX "assemblee_nomassemble_key" ON "public"."assemblee"("nomassemble");

-- CreateIndex
CREATE INDEX "idx_assemblee_nom" ON "public"."assemblee"("nomassemble");

-- CreateIndex
CREATE INDEX "idx_assembleeplanning_planning" ON "public"."assembleeplanning"("idplanning", "idassemblee");

-- CreateIndex
CREATE INDEX "idx_code_recup_statut" ON "public"."coderecuperation"("statut");

-- CreateIndex
CREATE INDEX "idx_connexion_statut" ON "public"."connexion"("statutconnexion");

-- CreateIndex
CREATE INDEX "idx_inscription_statut" ON "public"."inscription"("statut");

-- CreateIndex
CREATE INDEX "idx_interaction_type_id" ON "public"."interaction"("ressourcetype", "ressourceid");

-- CreateIndex
CREATE INDEX "idx_live_statut" ON "public"."live"("statutlive");

-- CreateIndex
CREATE INDEX "idx_login_history_login_time" ON "public"."loginhistory"("logintime");

-- CreateIndex
CREATE UNIQUE INDEX "membre_codemembre_key" ON "public"."membre"("codemembre");

-- CreateIndex
CREATE INDEX "idx_membre_code" ON "public"."membre"("codemembre");

-- CreateIndex
CREATE INDEX "idx_membre_personne_assemblee" ON "public"."membre"("idpersonne", "idassemblee");

-- CreateIndex
CREATE INDEX "idx_membre_statut" ON "public"."membre"("statutmembre");

-- CreateIndex
CREATE UNIQUE INDEX "pays_nompays_key" ON "public"."pays"("nompays");

-- CreateIndex
CREATE INDEX "idx_pays_nom" ON "public"."pays"("nompays");

-- CreateIndex
CREATE UNIQUE INDEX "personne_telephone_key" ON "public"."personne"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "personne_email_key" ON "public"."personne"("email");

-- CreateIndex
CREATE INDEX "idx_personne_nom_prenom" ON "public"."personne"("nom", "prenom");

-- CreateIndex
CREATE INDEX "idx_personne_telephone" ON "public"."personne"("telephone");

-- CreateIndex
CREATE INDEX "idx_planning_statut" ON "public"."planning"("statutplanning");

-- CreateIndex
CREATE INDEX "idx_publication_expiration_date" ON "public"."publication"("expirationdate");

-- CreateIndex
CREATE INDEX "idx_publication_statut" ON "public"."publication"("statutpublication");

-- CreateIndex
CREATE INDEX "idx_responsabilite_statut" ON "public"."responsabilite"("statutresponsabilite");

-- CreateIndex
CREATE INDEX "idx_seance_statut" ON "public"."seance"("statutseance");

-- CreateIndex
CREATE INDEX "idx_session_statut" ON "public"."session"("statutsession");

-- CreateIndex
CREATE INDEX "idx_ville_nom" ON "public"."ville"("nomville");

-- AddForeignKey
ALTER TABLE "public"."activite" ADD CONSTRAINT "activite_idtypeactivites_fkey" FOREIGN KEY ("idtypeactivites") REFERENCES "public"."typeactivites"("idtypeactivites") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."activite_assemblee" ADD CONSTRAINT "activite_assemblee_idactivite_fkey" FOREIGN KEY ("idactivite") REFERENCES "public"."activite"("idactivite") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."activite_assemblee" ADD CONSTRAINT "activite_assemblee_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce" ADD CONSTRAINT "annonce_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce" ADD CONSTRAINT "annonce_idtypeannonce_fkey" FOREIGN KEY ("idtypeannonce") REFERENCES "public"."typeannonce"("idtypeannonce") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce_assemblee" ADD CONSTRAINT "annonce_assemblee_idannonce_fkey" FOREIGN KEY ("idannonce") REFERENCES "public"."annonce"("idannonce") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce_assemblee" ADD CONSTRAINT "annonce_assemblee_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce_departement" ADD CONSTRAINT "annonce_departement_idannonce_fkey" FOREIGN KEY ("idannonce") REFERENCES "public"."annonce"("idannonce") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."annonce_departement" ADD CONSTRAINT "annonce_departement_iddepartement_fkey" FOREIGN KEY ("iddepartement") REFERENCES "public"."departement"("iddepartement") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arrondissement" ADD CONSTRAINT "arrondissement_idville_fkey" FOREIGN KEY ("idville") REFERENCES "public"."ville"("idville") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."assemblee" ADD CONSTRAINT "assemblee_idarrondissement_fkey" FOREIGN KEY ("idarrondissement") REFERENCES "public"."arrondissement"("idarrondissement") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."assembleeplanning" ADD CONSTRAINT "assembleeplanning_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."assembleeplanning" ADD CONSTRAINT "assembleeplanning_idplanning_fkey" FOREIGN KEY ("idplanning") REFERENCES "public"."planning"("idplanning") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."coderecuperation" ADD CONSTRAINT "coderecuperation_connexionid_fkey" FOREIGN KEY ("connexionid") REFERENCES "public"."connexion"("connexionid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."connexion" ADD CONSTRAINT "connexion_idpersonne_fkey" FOREIGN KEY ("idpersonne") REFERENCES "public"."personne"("idpersonne") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."departement" ADD CONSTRAINT "departement_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."dirige" ADD CONSTRAINT "dirige_iddepartement_fkey" FOREIGN KEY ("iddepartement") REFERENCES "public"."departement"("iddepartement") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."dirige" ADD CONSTRAINT "dirige_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."est" ADD CONSTRAINT "est_iddepartement_fkey" FOREIGN KEY ("iddepartement") REFERENCES "public"."departement"("iddepartement") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."est" ADD CONSTRAINT "est_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inscription" ADD CONSTRAINT "inscription_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."interaction" ADD CONSTRAINT "interaction_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."intervenant" ADD CONSTRAINT "intervenant_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."live" ADD CONSTRAINT "fk_live_membre" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."live" ADD CONSTRAINT "live_idseance_fkey" FOREIGN KEY ("idseance") REFERENCES "public"."seance"("idseance") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."loginhistory" ADD CONSTRAINT "loginhistory_personnelid_fkey" FOREIGN KEY ("personnelid") REFERENCES "public"."personne"("idpersonne") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."membre" ADD CONSTRAINT "membre_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."membre" ADD CONSTRAINT "membre_idpersonne_fkey" FOREIGN KEY ("idpersonne") REFERENCES "public"."personne"("idpersonne") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."membre_badge" ADD CONSTRAINT "membre_badge_idbadge_fkey" FOREIGN KEY ("idbadge") REFERENCES "public"."badge"("idbadge") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."membre_badge" ADD CONSTRAINT "membre_badge_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."participe" ADD CONSTRAINT "participe_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."participe" ADD CONSTRAINT "participe_idseance_fkey" FOREIGN KEY ("idseance") REFERENCES "public"."seance"("idseance") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."profilassemblee" ADD CONSTRAINT "profilassemblee_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."profildepartement" ADD CONSTRAINT "profildepartement_iddepartement_fkey" FOREIGN KEY ("iddepartement") REFERENCES "public"."departement"("iddepartement") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."profilpersonne" ADD CONSTRAINT "profilpersonne_idpersonne_fkey" FOREIGN KEY ("idpersonne") REFERENCES "public"."personne"("idpersonne") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."publication" ADD CONSTRAINT "publication_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."publication" ADD CONSTRAINT "publication_idtypepublication_fkey" FOREIGN KEY ("idtypepublication") REFERENCES "public"."typepublication"("idtypepublication") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."publication_action" ADD CONSTRAINT "publication_action_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."publication_action" ADD CONSTRAINT "publication_action_idpublication_fkey" FOREIGN KEY ("idpublication") REFERENCES "public"."publication"("idpublication") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."responsabilite" ADD CONSTRAINT "responsabilite_idtyperesponsabilite_fkey" FOREIGN KEY ("idtyperesponsabilite") REFERENCES "public"."typeresponsabilite"("idtyperesponsabilite") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."seance" ADD CONSTRAINT "seance_idactivite_fkey" FOREIGN KEY ("idactivite") REFERENCES "public"."activite"("idactivite") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."seance" ADD CONSTRAINT "seance_idintervenant_fkey" FOREIGN KEY ("idintervenant") REFERENCES "public"."intervenant"("idintervenant") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."seance" ADD CONSTRAINT "seance_idplanning_fkey" FOREIGN KEY ("idplanning") REFERENCES "public"."planning"("idplanning") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_connexionid_fkey" FOREIGN KEY ("connexionid") REFERENCES "public"."connexion"("connexionid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."ville" ADD CONSTRAINT "ville_idpays_fkey" FOREIGN KEY ("idpays") REFERENCES "public"."pays"("idpays") ON DELETE CASCADE ON UPDATE NO ACTION;
