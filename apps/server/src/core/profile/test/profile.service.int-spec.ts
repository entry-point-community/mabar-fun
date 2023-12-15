import { Test, TestingModule } from '@nestjs/testing';
import { MlbbRole, Profile } from '@prisma/client';

import { PrismaService } from '~/lib/prisma.service';
import { ProfileModule } from '../profile.module';
import { ProfileService } from '../profile.service';
import { eventSeeder, profileSeeder } from './fixtures';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let prismaService: PrismaService;
  let profile: Profile;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProfileModule],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    prismaService = module.get<PrismaService>(PrismaService);

    profile = await prismaService.profile.create({
      data: profileSeeder,
    });

    const event = await prismaService.event.create({
      data: eventSeeder,
    });

    await prismaService.eventRegistration.create({
      data: {
        role: MlbbRole.GOLD,
        event: {
          connect: {
            id: event.id,
          },
        },
        player: {
          connect: {
            userId: profile.userId,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
  });

  describe('getUserRegisteredEvents', () => {
    it.todo(
      'should return a list of events the user has registered in',
      async () => {
        const registeredEvents = await profileService.getUserRegisteredEvents(
          profile.userId,
          {},
        );

        expect(registeredEvents.records.length).toBe(1);
        expect(registeredEvents.count).toBe(1);
      },
    );
  });
});
