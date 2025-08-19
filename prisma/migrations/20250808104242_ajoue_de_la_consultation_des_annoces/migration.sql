-- CreateTable
CREATE TABLE "public"."consultation_annonce" (
    "idconsultation" SERIAL NOT NULL,
    "idmembre" INTEGER NOT NULL,
    "idannonce" INTEGER NOT NULL,
    "dateconsultation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultation_annonce_pkey" PRIMARY KEY ("idconsultation")
);

-- CreateIndex
CREATE INDEX "consultation_annonce_idmembre_idx" ON "public"."consultation_annonce"("idmembre");

-- CreateIndex
CREATE INDEX "consultation_annonce_idannonce_idx" ON "public"."consultation_annonce"("idannonce");

-- CreateIndex
CREATE UNIQUE INDEX "consultation_annonce_idmembre_idannonce_key" ON "public"."consultation_annonce"("idmembre", "idannonce");

-- AddForeignKey
ALTER TABLE "public"."consultation_annonce" ADD CONSTRAINT "consultation_annonce_idmembre_fkey" FOREIGN KEY ("idmembre") REFERENCES "public"."membre"("idmembre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."consultation_annonce" ADD CONSTRAINT "consultation_annonce_idannonce_fkey" FOREIGN KEY ("idannonce") REFERENCES "public"."annonce"("idannonce") ON DELETE CASCADE ON UPDATE CASCADE;
