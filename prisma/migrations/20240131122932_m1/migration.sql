/*
  Warnings:

  - You are about to drop the column `avaliacaoMetascore` on the `Filme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "avaliacaoMetascore",
ADD COLUMN     "avaliacaoMetacritic" INTEGER;
