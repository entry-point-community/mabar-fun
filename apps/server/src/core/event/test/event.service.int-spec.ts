import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MlbbRole } from '@prisma/client';
import { addMonths, subDays, subMonths } from 'date-fns';
import * as Mockdate from 'mockdate';

import { creatorSeeder, userSeeder } from '~/core/auth/test/fixtures';
import { PrismaService } from '~/lib/prisma.service';
import { EventService } from '../event.service';
import { eventsSeeders, eventTeamsSeeders, profileSeeder } from './fixtures';

describe('EventService', () => {
  let eventService: EventService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService],
    }).compile();

    eventService = module.get<EventService>(EventService);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.profile.createMany({
      data: [profileSeeder, userSeeder, creatorSeeder],
    });

    await prismaService.event.createMany({
      data: eventsSeeders,
    });

    await prismaService.eventTeam.createMany({
      data: eventTeamsSeeders,
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

  describe('getEventById', () => {
    describe('when given a valid ID', () => {
      it('should return an event', async () => {
        const event = await eventService.getEventById(1);

        expect(event).toBeDefined();
        expect(event?.id).toBe(1);
      });
    });

    describe('when given an ID which does not exist', () => {
      it('should throw a not found exception', async () => {
        await expect(eventService.getEventById(100)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('registerToEvent', () => {
    describe('when given a valid event ID and user has not been registered to the event yet', () => {
      it('should successfully register the user', async () => {
        const eventRegistration = await eventService.registerToEvent(
          userSeeder.userId,
          {
            eventId: 1,
            mlbbRole: MlbbRole.JUNGLE,
          },
        );

        expect(eventRegistration).toMatchObject({
          profileUserId: userSeeder.userId,
          eventId: 1,
        });
      });
    });

    describe('when given a valid event ID but user has been registered to the event', () => {
      it('should successfully register the user', async () => {
        const eventRegistration = eventService.registerToEvent(
          userSeeder.userId,
          {
            eventId: 1,
            mlbbRole: MlbbRole.GOLD,
          },
        );

        await expect(eventRegistration).rejects.toThrow(
          'user has already been registered to the event',
        );
      });
    });

    describe('when given an event ID that does not exist', () => {
      it('should throw a not found exception', async () => {
        const eventRegistration = eventService.registerToEvent(
          profileSeeder.userId,
          {
            eventId: 100,
            mlbbRole: MlbbRole.JUNGLE,
          },
        );

        await expect(eventRegistration).rejects.toThrow('event not found');
      });
    });

    describe('when attempting to join owned event', () => {
      it('should throw an unprocessable entity exception', async () => {
        const eventRegistration = eventService.registerToEvent(
          profileSeeder.userId,
          {
            eventId: 1,
            mlbbRole: MlbbRole.JUNGLE,
          },
        );

        await expect(eventRegistration).rejects.toThrow(
          'unable to join owned event',
        );
      });
    });

    describe('when user has no MLBB username', () => {
      it('should throw an unprocessable entity exception', async () => {
        await prismaService.profile.update({
          data: {
            mlbbUsername: null,
          },
          where: {
            userId: creatorSeeder.userId,
          },
        });

        const eventRegistration = eventService.registerToEvent(
          creatorSeeder.userId,
          {
            eventId: 1,
            mlbbRole: MlbbRole.JUNGLE,
          },
        );

        await expect(eventRegistration).rejects.toThrow(
          'user has no MLBB username',
        );

        await prismaService.profile.update({
          data: {
            mlbbUsername: faker.person.firstName(),
          },
          where: {
            userId: creatorSeeder.userId,
          },
        });
      });
    });

    describe('when attempting to register before registration date', () => {
      it('should throw an unprocessable entity exception', async () => {
        Mockdate.set(subDays(new Date(), 1));

        const eventRegistration = eventService.registerToEvent(
          userSeeder.userId,
          {
            eventId: 2,
            mlbbRole: MlbbRole.JUNGLE,
          },
        );

        await expect(eventRegistration).rejects.toThrow(
          'registration is not opened yet',
        );

        Mockdate.reset();
      });
    });
  });

  describe('createEvent', () => {
    it('should create an event', async () => {
      const event = await eventService.createEvent(
        {
          title: 'Test event 1',
          description: 'Description 1',
          startRegistrationDate: new Date(),
          endRegistrationDate: addMonths(new Date(), 1),
          maxPlayers: 50,
        },
        creatorSeeder.userId,
      );

      expect(event).toMatchObject({
        title: 'Test event 1',
        description: 'Description 1',
      });
    });

    describe('when end registration date is before start registration date', () => {
      it('should throw an unprocessable entity exception', async () => {
        const event = eventService.createEvent(
          {
            title: 'Test event 1',
            description: 'Description 1',
            startRegistrationDate: new Date(),
            endRegistrationDate: subMonths(new Date(), 1),
            maxPlayers: 50,
          },
          creatorSeeder.userId,
        );

        await expect(event).rejects.toThrow(
          "end registration date shouldn't be before start registration date",
        );
      });
    });

    describe('when user is not a creator', () => {
      it('should throw an unauthorized exception', async () => {
        const event = eventService.createEvent(
          {
            title: 'Test event 1',
            description: 'Description 1',
            startRegistrationDate: new Date(),
            endRegistrationDate: addMonths(new Date(), 1),
            maxPlayers: 50,
          },
          userSeeder.userId,
        );

        await expect(event).rejects.toThrow('user is not a creator');
      });
    });
  });

  describe('getEventTeams', () => {
    it('should return a list of event teams', async () => {
      const eventTeams = await eventService.getEventTeams(1);

      expect(eventTeams.length).toBe(5);
    });
  });

  describe('createTeamForEvent', () => {
    it('should create a team for an event', async () => {
      const team = await eventService.createTeamForEvent(
        1,
        profileSeeder.userId,
      );

      expect(team).toMatchObject({
        eventId: 1,
      });
    });

    describe('when event does not belong to requesting user', () => {
      it('should throw a not found exception', async () => {
        const event = eventService.createTeamForEvent(1, userSeeder.userId);

        await expect(event).rejects.toThrow('event not found');
      });
    });
  });

  describe('getEventRegisteredPlayers', () => {
    it('should return a list of players for an event', async () => {
      const registeredPlayers = await eventService.getEventRegisteredPlayers(1);

      expect(registeredPlayers.length).toBeGreaterThan(0);
    });
  });

  describe('updateEvent', () => {
    it('should update the event', async () => {
      const updatedEvent = await eventService.updateEvent(
        eventsSeeders[0].profileUserId,
        1,
        {
          description: 'Updated description',
        },
      );

      expect(updatedEvent.description).toBe('Updated description');
    });

    describe("when given an event ID that  doesn't exist", () => {
      it('should throw a not found exception', async () => {
        const updatedEvent = eventService.updateEvent(
          eventsSeeders[0].profileUserId,
          100,
          {
            description: 'Updated description',
          },
        );

        expect(updatedEvent).rejects.toThrow('event not found');
      });
    });
  });
});
