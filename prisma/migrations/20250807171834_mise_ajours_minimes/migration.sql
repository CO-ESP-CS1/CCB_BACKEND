/*
  Warnings:

  - The `typeplanning` column on the `planning` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `mediaurl` on the `publication` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2083)`.
  - Added the required column `idactivite` to the `inscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."type_planning_enum" AS ENUM ('JOURNALIER', 'HEBDOMADAIRE', 'MENSUEL', 'TRIMESTRIEL', 'SEMESTRIEL', 'ANNUEL');

-- AlterTable
ALTER TABLE "public"."activite" ADD COLUMN     "necessiteInscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicCible" TEXT;

-- AlterTable
ALTER TABLE "public"."inscription" ADD COLUMN     "idactivite" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."planning" DROP COLUMN "typeplanning",
ADD COLUMN     "typeplanning" "public"."type_planning_enum";

-- AlterTable
ALTER TABLE "public"."publication" ADD COLUMN     "mediaurl2" VARCHAR(2083),
ADD COLUMN     "mediaurl3" VARCHAR(2083),
ADD COLUMN     "titre" VARCHAR(255),
ALTER COLUMN "mediaurl" SET DATA TYPE VARCHAR(2083);

-- AddForeignKey
ALTER TABLE "public"."inscription" ADD CONSTRAINT "inscription_idactivite_fkey" FOREIGN KEY ("idactivite") REFERENCES "public"."activite"("idactivite") ON DELETE CASCADE ON UPDATE CASCADE;
