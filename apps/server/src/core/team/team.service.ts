import { Injectable, NotFoundException } from '@nestjs/common';
import { MlbbRole } from '@prisma/client';

import { PrismaService } from '~/lib/prisma.service';

@Injectable()
export class TeamService {
  constructor(private readonly prismaService: PrismaService) {}

  public async registerPlayerToTeam(
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
    });

    if (!team) throw new NotFoundException('team not found');

    const teamPlayer = await this.prismaService.eventTeamPlayer.create({
      data: {
        role: mlbbRole,
        eventTeamId: teamId,
        profileUserId: playerId,
      },
    });

    return teamPlayer;
  }
}
