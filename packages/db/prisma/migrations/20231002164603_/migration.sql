-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "displayName" TEXT;

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileHero" (
    "heroId" INTEGER NOT NULL,
    "profileUserId" UUID NOT NULL,

    CONSTRAINT "ProfileHero_pkey" PRIMARY KEY ("heroId","profileUserId")
);

-- AddForeignKey
ALTER TABLE "ProfileHero" ADD CONSTRAINT "ProfileHero_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileHero" ADD CONSTRAINT "ProfileHero_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
