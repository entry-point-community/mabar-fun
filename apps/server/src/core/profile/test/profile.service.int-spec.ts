import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '~/lib/prisma.service';
import { SupabaseService } from '~/lib/supabase.service';
import { ProfileService } from '../profile.service';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
