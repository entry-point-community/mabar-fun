import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditProfileDTO } from '@v6/dto';

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

  @Patch()
  @UseGuards(SupabaseGuard)
  @UseInterceptors(FileInterceptor('profile-picture'))
  public async editProfile(
    @User() user: AuthUser,
    @Body() editProfileDTO: EditProfileDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
        fileIsRequired: false,
      }),
    )
    profilePictureFile?: Express.Multer.File,
  ) {
    const profile = await this.profileService.editProfile(
      user.sub,
      editProfileDTO,
      profilePictureFile,
    );

    return profile;
  }
}
