import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { RegisterPlayerDTO } from '@v6/dto';

import { SupabaseGuard } from '../auth/supabase/supabase.guard';
import { AuthUser } from '../auth/types';
import { User } from '../auth/user.decorator';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post('/:teamId')
  @UseGuards(SupabaseGuard)
  public async registerPlayerToTeam(
    @User() user: AuthUser,
    @Param('teamId') teamId: number,
    @Body() body: RegisterPlayerDTO,
  ) {
    const teamPlayer = await this.teamService.registerPlayerToTeam(user.sub, {
      ...body,
      teamId,
    });

    return teamPlayer;
  }
}
