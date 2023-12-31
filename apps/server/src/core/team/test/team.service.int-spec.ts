import { Test, TestingModule } from '@nestjs/testing';
import { MlbbRole, Prisma } from '@prisma/client';

import { creatorSeeder, userSeeder } from '~/core/auth/test/fixtures';
import {
  eventsSeeders,
  eventTeamsSeeders,
  profileSeeder,
} from '~/core/event/test/fixtures';
import { PrismaService } from '~/lib/prisma.service';
import { TeamService } from '../team.service';

describe('TeamService', () => {
  let teamService: TeamService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamService, PrismaService],
    }).compile();

    teamService = module.get<TeamService>(TeamService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.profile.createMany({
      data: [profileSeeder, userSeeder, creatorSeeder],
    });

    await prismaService.event.createMany({
      data: eventsSeeders,
    });

    await prismaService.eventTeam.createMany({
      data: eventTeamsSeeders,
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(teamService).toBeDefined();
  });

  describe('addPlayerToTeam', () => {
    it('should add player to a team', async () => {
      const teamPlayer = await teamService.addPlayerToTeam(
        profileSeeder.userId,
        {
          mlbbRole: MlbbRole.JUNGLE,
          playerId: userSeeder.userId,
          teamId: 1,
        },
      );

      expect(teamPlayer).toBeDefined();
    });

    describe('when request is not made by event owner', () => {
      it('should throw a not found error', async () => {
        const teamPlayer = teamService.addPlayerToTeam(userSeeder.userId, {
          mlbbRole: MlbbRole.JUNGLE,
          playerId: creatorSeeder.userId,
          teamId: 1,
        });

        await expect(teamPlayer).rejects.toThrow('team not found');
      });
    });

    describe('when user has already been registered to team', () => {
      it('should add player to a team', async () => {
        const teamPlayer = teamService.addPlayerToTeam(profileSeeder.userId, {
          mlbbRole: MlbbRole.JUNGLE,
          playerId: userSeeder.userId,
          teamId: 1,
        });

        await expect(teamPlayer).rejects.toThrow(
          'player already registered to this team',
        );
      });
    });
  });

  describe('deletePlayerFromTeam', () => {
    it('should delete player from team', async () => {
      await teamService.deletePlayerFromTeam(
        profileSeeder.userId,
        1,
        userSeeder.userId,
      );

      const team = await prismaService.eventTeam.findUnique({
        where: {
          id: 1,
        },
        include: {
          EventTeamPlayer: true,
        },
      });

      expect(team?.EventTeamPlayer.length).toBe(0);
    });

    describe('when request is not made by event owner', () => {
      it('should throw a prisma error', async () => {
        const deletePlayer = teamService.deletePlayerFromTeam(
          creatorSeeder.userId,
          1,
          userSeeder.userId,
        );

        expect(deletePlayer).rejects.toThrow(
          Prisma.PrismaClientKnownRequestError,
        );
      });
    });
  });

  describe('deleteTeam', () => {
    describe('when team has no players', () => {
      it('should delete team', async () => {
        await teamService.deleteTeam(profileSeeder.userId, 2);

        const deletedTeam = await prismaService.eventTeam.findUnique({
          where: {
            id: 2,
          },
        });

        expect(deletedTeam).toBe(null);
      });
    });

    describe('when team has players registered', () => {
      it('should delete team', async () => {
        const TEAM_ID = 3;

        await prismaService.eventTeamPlayer.createMany({
          data: [
            {
              eventId: 1,
              eventTeamId: TEAM_ID,
              profileUserId: userSeeder.userId,
              role: 'JUNGLE',
            },
            {
              eventId: 1,
              eventTeamId: TEAM_ID,
              profileUserId: creatorSeeder.userId,
              role: 'GOLD',
            },
          ],
        });

        await teamService.deleteTeam(profileSeeder.userId, TEAM_ID);

        const deletedTeam = await prismaService.eventTeam.findUnique({
          where: {
            id: 3,
          },
        });

        expect(deletedTeam).toBe(null);
      });
    });
  });
});
