/*
  Warnings:

  - You are about to drop the column `endDate` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Event` table. All the data in the column will be lost.
  - Added the required column `bannerImageUrl` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endRegistrationDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startRegistrationDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('WAITING_FOR_PLAYERS', 'PLAYING', 'ENDED');

-- CreateEnum
CREATE TYPE "EventMatchesType" AS ENUM ('CUSTOM', 'PUBLIC');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "bannerImageUrl" TEXT NOT NULL,
ADD COLUMN     "endRegistrationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startRegistrationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "EventStatus" NOT NULL,
ADD COLUMN     "totalMatches" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "EventMatches" (
    "id" SERIAL NOT NULL,
    "homeEventTeamId" INTEGER NOT NULL,
    "awayEventTeamId" INTEGER,
    "eventTeamId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventMatches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventMatches" ADD CONSTRAINT "EventMatches_homeEventTeamId_fkey" FOREIGN KEY ("homeEventTeamId") REFERENCES "EventTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMatches" ADD CONSTRAINT "EventMatches_awayEventTeamId_fkey" FOREIGN KEY ("awayEventTeamId") REFERENCES "EventTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventMatches" ADD CONSTRAINT "EventMatches_eventTeamId_fkey" FOREIGN KEY ("eventTeamId") REFERENCES "EventTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
