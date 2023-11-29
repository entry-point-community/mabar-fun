-- DropForeignKey
ALTER TABLE "EventTeamPlayer" DROP CONSTRAINT "EventTeamPlayer_eventTeamId_fkey";

-- AddForeignKey
ALTER TABLE "EventTeamPlayer" ADD CONSTRAINT "EventTeamPlayer_eventTeamId_fkey" FOREIGN KEY ("eventTeamId") REFERENCES "EventTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
