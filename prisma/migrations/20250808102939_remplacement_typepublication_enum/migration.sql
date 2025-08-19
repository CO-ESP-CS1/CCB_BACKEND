/*
  Warnings:

  - You are about to drop the column `idtypepublication` on the `publication` table. All the data in the column will be lost.
  - You are about to drop the `typepublication` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."type_publication_enum" AS ENUM ('STORY', 'POST', 'VIDEO', 'SHORT');

-- DropForeignKey
ALTER TABLE "public"."publication" DROP CONSTRAINT "publication_idtypepublication_fkey";

-- AlterTable
ALTER TABLE "public"."publication" DROP COLUMN "idtypepublication",
ADD COLUMN     "esttemporaire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "typepublication" "public"."type_publication_enum";

-- DropTable
DROP TABLE "public"."typepublication";
