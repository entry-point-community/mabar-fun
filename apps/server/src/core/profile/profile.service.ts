import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EditProfileDTO } from '@v6/dto';

import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { SupabaseBucket } from '~/types/supabase-bucket.enum';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  public async getProfile(userId: string) {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        userId,
      },
      include: {
        ProfileHero: {
          include: {
            hero: true,
          },
        },
      },
    });

    return profile;
  }

  public async editProfile(
    userId: string,
    editProfileDTO: EditProfileDTO,
    profilePictureFile?: Express.Multer.File,
  ) {
    const editProfilePayload: Prisma.ProfileUpdateInput = {
      ...editProfileDTO,
    };

    if (profilePictureFile) {
      const fileUrl = await this.supabaseService.uploadToPublicStorage(
        SupabaseBucket.PROFILE_PICTURES,
        profilePictureFile,
        userId,
      );

      editProfilePayload.profilePictureUrl = fileUrl;
    }

    const updatedProfile = await this.prismaService.profile.update({
      data: editProfilePayload,
      where: {
        userId,
      },
    });

    return updatedProfile;
  }
}
