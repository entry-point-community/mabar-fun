import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MlbbRole } from '@prisma/client';

import { PrismaService } from '~/lib/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  public async addPlayerToTeam(
    ownerId: string,
    {
      teamId,
      mlbbRole,
      playerId,
    }: {
      teamId: number;
      mlbbRole: MlbbRole;
      playerId: string;
    },
  ) {
    const team = await this.prismaService.eventTeam.findFirst({
      where: {
        id: teamId,
        event: {
          profileUserId: ownerId,
        },
      },
      include: {
        EventTeamPlayer: true,
      },
    });

    if (!team) throw new NotFoundException('team not found');

    if (
      team.EventTeamPlayer.some((player) => player.profileUserId === playerId)
    ) {
      throw new UnprocessableEntityException(
        'player already registered to this team',
      );
    }

    const teamPlayer = await this.prismaService.eventTeamPlayer.create({
      data: {
        role: mlbbRole,
        eventTeamId: teamId,
        profileUserId: playerId,
        eventId: team.eventId,
      },
    });

    return teamPlayer;
  }

  public async deletePlayerFromTeam(
    ownerUserId: string,
    teamId: number,
    toBeDeletedPlayerId: string,
  ) {
    const eventTeamPlayer = await this.prismaService.eventTeamPlayer.delete({
      where: {
        eventTeamId_profileUserId: {
          profileUserId: toBeDeletedPlayerId,
          eventTeamId: teamId,
        },
        event: {
          profileUserId: ownerUserId,
        },
      },
    });

    return eventTeamPlayer;
  }

  public async deleteTeam(userId: string, teamId: number) {
    const deletedTeam = await this.prismaService.eventTeam.delete({
      where: {
        id: teamId,
        event: {
          profileUserId: userId,
        },
      },
    });

    return deletedTeam;
  }
}
