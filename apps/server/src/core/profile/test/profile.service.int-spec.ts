import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { config } from '~/config';
import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { ProfileService } from '../profile.service';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: config.apiGamesBaseUrl,
        }),
      ],
      providers: [ProfileService, PrismaService, SupabaseService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });
});
