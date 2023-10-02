import { Injectable } from '@nestjs/common';

import { PrismaService } from '~/lib/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
