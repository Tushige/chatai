/*
  Warnings:

  - You are about to drop the column `customerId` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `conversations` on the `ChatBot` table. All the data in the column will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerResponses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HelpDesk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_customerId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_domainId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerResponses" DROP CONSTRAINT "CustomerResponses_customerId_fkey";

-- DropForeignKey
ALTER TABLE "HelpDesk" DROP CONSTRAINT "HelpDesk_domainId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_domainId_fkey";

-- AlterTable
ALTER TABLE "Bookings" DROP COLUMN "customerId",
ADD COLUMN     "contactId" UUID;

-- AlterTable
ALTER TABLE "ChatBot" DROP COLUMN "conversations",
ADD COLUMN     "conversationIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "CustomerResponses";

-- DropTable
DROP TABLE "HelpDesk";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "DiscoveryResponses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "contactId" UUID NOT NULL,

    CONSTRAINT "DiscoveryResponses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "conversationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "domainId" UUID,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiscoveryResponses" ADD CONSTRAINT "DiscoveryResponses_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
