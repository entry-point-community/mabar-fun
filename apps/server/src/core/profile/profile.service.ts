import { HttpService } from '@nestjs/axios';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MlbbRole, Prisma } from '@prisma/client';
import { EditProfileDTO } from '@v6/dto';

import { config } from '~/config';
import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { SupabaseBucket } from '~/types/supabase-bucket.enum';
import { ApiGamesMobileLegendsVerifyAccountResponse } from './types';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly apiGamesHttpService: HttpService,
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

    const mlbbAccountUsername = await this.getMlbbAccountUsername(
      editProfileDTO.mlbbUserId,
      editProfileDTO.mlbbServerId,
    );

    editProfilePayload.mlbbUsername = mlbbAccountUsername;

    const updatedProfile = await this.prismaService.profile.upsert({
      create: {
        displayName: String(editProfilePayload.displayName),
        mlbbRole: editProfilePayload.mlbbRole as MlbbRole,
        mlbbServerId: String(editProfilePayload.mlbbServerId),
        mlbbUsername: editProfilePayload.mlbbUsername,
        userId,
      },
      update: editProfilePayload,
      where: {
        userId,
      },
    });

    return updatedProfile;
  }

  // based on docs: https://docs.apigames.id/docs/cek-username
  public async getMlbbAccountUsername(
    mlbbUserId: string,
    mlbbServerId: string,
  ) {
    const mlbbAccountPayload = `${mlbbUserId}(${mlbbServerId})`;

    const { data } =
      await this.apiGamesHttpService.axiosRef.get<ApiGamesMobileLegendsVerifyAccountResponse>(
        `/merchant/${config.apiGamesMerchantId}/cek-username/mobilelegend`,
        {
          params: {
            user_id: mlbbAccountPayload,
            signature: config.apiGamesSignature,
          },
        },
      );

    if (data.status === 0) {
      throw new UnprocessableEntityException('invalid user ID or zone ID');
    }

    return data.data?.username as string;
  }
}
