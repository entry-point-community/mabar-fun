-- CreateEnum
CREATE TYPE "MlbbRole" AS ENUM ('EXP', 'JUNGLE', 'MID', 'GOLD', 'ROAM');

-- CreateTable
CREATE TABLE "Profile" (
    "userId" UUID NOT NULL,
    "mlbbUsername" TEXT,
    "mlbbUserId" TEXT,
    "mlbbServerId" TEXT,
    "mlbbRole" "MlbbRole",
    "profilePictureUrl" TEXT,
    "isCreator" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profileUserId" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "eventId" INTEGER NOT NULL,
    "profileUserId" UUID NOT NULL,
    "role" "MlbbRole" NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("eventId","profileUserId")
);

-- CreateTable
CREATE TABLE "EventTeam" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTeamPlayer" (
    "role" "MlbbRole" NOT NULL,
    "eventTeamId" INTEGER NOT NULL,
    "profileUserId" UUID NOT NULL,

    CONSTRAINT "EventTeamPlayer_pkey" PRIMARY KEY ("eventTeamId","profileUserId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeam" ADD CONSTRAINT "EventTeam_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamPlayer" ADD CONSTRAINT "EventTeamPlayer_eventTeamId_fkey" FOREIGN KEY ("eventTeamId") REFERENCES "EventTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTeamPlayer" ADD CONSTRAINT "EventTeamPlayer_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
