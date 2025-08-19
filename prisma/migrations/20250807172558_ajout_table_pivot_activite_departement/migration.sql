-- CreateTable
CREATE TABLE "public"."activite_departement" (
    "idactivite" INTEGER NOT NULL,
    "iddepartement" INTEGER NOT NULL,

    CONSTRAINT "activite_departement_pkey" PRIMARY KEY ("idactivite","iddepartement")
);

-- CreateIndex
CREATE INDEX "idx_activitedepartement_departement" ON "public"."activite_departement"("iddepartement");

-- AddForeignKey
ALTER TABLE "public"."activite_departement" ADD CONSTRAINT "activite_departement_idactivite_fkey" FOREIGN KEY ("idactivite") REFERENCES "public"."activite"("idactivite") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activite_departement" ADD CONSTRAINT "activite_departement_iddepartement_fkey" FOREIGN KEY ("iddepartement") REFERENCES "public"."departement"("iddepartement") ON DELETE CASCADE ON UPDATE CASCADE;
