import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common';

import { SupabaseGuard } from '~/core/auth/supabase/supabase.guard';
import { AuthUser } from '~/core/auth/types';
import { User } from '~/core/auth/user.decorator';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(SupabaseGuard)
  public async getProfile(@User() user: AuthUser) {
    const profile = await this.profileService.getProfile(user.sub);

    if (!profile) {
      throw new NotFoundException('profile not found');
    }

    return profile;
  }
}
