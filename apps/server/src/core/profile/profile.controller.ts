import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  ParseFilePipe,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  EditProfileDTO,
  GetMlbbAccountDTO,
  GetRegisteredEvents,
} from '@v6/dto';

import { SupabaseGuard } from '~/core/auth/supabase/supabase.guard';
import { AuthUser } from '~/core/auth/types';
import { User } from '~/core/auth/user.decorator';
import { PaginationService } from '../pagination/pagination.service';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly paginationService: PaginationService,
  ) {}

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

  @Get('/mlbb-account')
  @UseGuards(SupabaseGuard)
  public async getMlbbAccountUsername(
    @Query() { mlbbServerId, mlbbUserId }: GetMlbbAccountDTO,
  ) {
    const mlbbAccountUsername =
      await this.profileService.getMlbbAccountUsername(
        mlbbUserId,
        mlbbServerId,
      );

    return mlbbAccountUsername;
  }

  @Get('/event-registrations')
  @UseGuards(SupabaseGuard)
  public async getUserRegisteredEvents(
    @User() user: AuthUser,
    @Query() query: GetRegisteredEvents,
  ) {
    const { count, records } =
      await this.profileService.getUserRegisteredEvents(user.sub, query);

    return await this.paginationService.buildPaginationResponse(records, {
      count,
    });
  }
}
