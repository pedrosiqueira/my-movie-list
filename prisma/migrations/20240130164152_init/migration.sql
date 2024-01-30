-- CreateTable
CREATE TABLE "Status" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filme" (
    "id" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tituloOriginal" TEXT NOT NULL,
    "titulo" TEXT,
    "sinopse" TEXT,
    "synopsis" TEXT,
    "classificacaoIndicativa" INTEGER,
    "avaliacaoIMDB" DOUBLE PRECISION,
    "avaliacaoMetascore" INTEGER,
    "avaliacaoTomatometer" INTEGER,
    "avaliacaoTomatoAudicence" INTEGER,
    "urlCapa" TEXT,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_status_key" ON "Status"("status");

-- AddForeignKey
ALTER TABLE "Filme" ADD CONSTRAINT "Filme_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
