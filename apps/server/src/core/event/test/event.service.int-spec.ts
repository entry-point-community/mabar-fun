import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '~/lib/prisma.service';
import { EventService } from '../event.service';
import { eventsSeeders, profileSeeder } from './fixtures';

describe('EventService', () => {
  let eventService: EventService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService],
    }).compile();

    eventService = module.get<EventService>(EventService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.profile.create({
      data: profileSeeder,
    });

    await prismaService.event.createMany({
      data: eventsSeeders,
    });
  });

  afterAll(async () => {
    await prismaService.cleanDatabase();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
  });

  describe('getEvents', () => {
    it('should return a list of events', async () => {
      const { records, count } = await eventService.getEvents({});

      expect(records.length).toBe(5);
      expect(count).toBe(5);
    });

    describe('when given pagination params', () => {
      it('should return limited list of events', async () => {
        const { records, count } = await eventService.getEvents({ limit: 3 });

        expect(records.length).toBe(3);
        expect(count).toBe(3);
      });
    });
  });
});
