-- CreateTable
CREATE TABLE "public"."cotisation" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "idassemblee" INTEGER NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cotisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paiement" (
    "id" SERIAL NOT NULL,
    "idmembre" INTEGER NOT NULL,
    "idcotisation" INTEGER NOT NULL,
    "montant" DECIMAL(10,2) NOT NULL,
    "code_transaction" VARCHAR(100),
    "statut" VARCHAR(20) NOT NULL,
    "createat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_cotisation_assemblee" ON "public"."cotisation"("idassemblee");

-- CreateIndex
CREATE UNIQUE INDEX "paiement_code_transaction_key" ON "public"."paiement"("code_transaction");

-- CreateIndex
CREATE INDEX "idx_paiement_membre" ON "public"."paiement"("idmembre");

-- CreateIndex
CREATE INDEX "idx_paiement_cotisation" ON "public"."paiement"("idcotisation");

-- CreateIndex
CREATE UNIQUE INDEX "idx_paiement_membre_cotisation" ON "public"."paiement"("idmembre", "idcotisation");

-- AddForeignKey
ALTER TABLE "public"."cotisation" ADD CONSTRAINT "cotisation_idassemblee_fkey" FOREIGN KEY ("idassemblee") REFERENCES "public"."assemblee"("idassemblee") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."paiement" ADD CONSTRAINT "paiement_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."paiement" ADD CONSTRAINT "paiement_idcotisation_fkey" FOREIGN KEY ("idcotisation") REFERENCES "public"."cotisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
