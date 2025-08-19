-- CreateEnum
CREATE TYPE "public"."role_enum" AS ENUM ('pasteur', 'membre', 'apotre', 'diacre', 'ancien', 'patriarche');

-- AlterTable
ALTER TABLE "public"."membre" ADD COLUMN     "role" "public"."role_enum" NOT NULL DEFAULT 'membre';
