/*
  Warnings:

  - You are about to drop the column `avaliacaoTomatoAudicence` on the `Filme` table. All the data in the column will be lost.
  - You are about to drop the column `synopsis` on the `Filme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "avaliacaoTomatoAudicence",
DROP COLUMN "synopsis",
ADD COLUMN     "avaliacaoTomatoAudience" INTEGER,
ADD COLUMN     "urlRottenTomatoes" TEXT;
