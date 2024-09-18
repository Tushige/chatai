/*
  Warnings:

  - You are about to drop the `FilterQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FilterQuestions" DROP CONSTRAINT "FilterQuestions_domainId_fkey";

-- DropTable
DROP TABLE "FilterQuestions";

-- CreateTable
CREATE TABLE "Questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "domainId" UUID,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;
