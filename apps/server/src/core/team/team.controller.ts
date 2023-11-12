import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AddPlayerToTeamDTO } from '@v6/dto';

import { SupabaseGuard } from '../auth/supabase/supabase.guard';
import { AuthUser } from '../auth/types';
import { User } from '../auth/user.decorator';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/:teamId/players')
  @UseGuards(SupabaseGuard)
  public async addPlayerToTeam(
    @User() user: AuthUser,
    @Param('teamId') teamId: number,
    @Body() body: AddPlayerToTeamDTO,
  ) {
    const teamPlayer = await this.teamService.addPlayerToTeam(user.sub, {
      ...body,
      teamId,
    });

    return teamPlayer;
  }
}
