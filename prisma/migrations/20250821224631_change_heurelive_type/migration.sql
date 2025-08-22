/*
  Warnings:

  - The `heuredebut` column on the `live` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `heurefin` column on the `live` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."live" DROP COLUMN "heuredebut",
ADD COLUMN     "heuredebut" TIMESTAMP(3),
DROP COLUMN "heurefin",
ADD COLUMN     "heurefin" TIMESTAMP(3);
