import { Test, TestingModule } from '@nestjs/testing';
import { MlbbRole } from '@prisma/client';

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
});
