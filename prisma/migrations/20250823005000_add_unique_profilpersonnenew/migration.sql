/*
  Warnings:

  - A unique constraint covering the columns `[idpersonne]` on the table `profilpersonne` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "profilpersonne_idpersonne_key" ON "public"."profilpersonne"("idpersonne");
