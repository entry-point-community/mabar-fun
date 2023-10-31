/*
  Warnings:

  - You are about to drop the column `bannerImageUrl` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "bannerImageUrl",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "EventStatus";
