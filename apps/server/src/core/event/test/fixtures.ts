import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';

export const profileSeeder: Prisma.ProfileCreateInput = {
  userId: '36d23b5f-241d-40b0-96c0-065a6b2a6638',
};

export const eventsSeeders: Prisma.EventCreateManyInput[] = [
  {
    bannerImageUrl: 'image-url',
    profileUserId: profileSeeder.userId,
    description: 'description',
    startRegistrationDate: new Date(),
    endRegistrationDate: addMonths(new Date(), 1),
    status: 'WAITING_FOR_PLAYERS',
    title: 'Event 1',
  },
  {
    bannerImageUrl: 'image-url',
    profileUserId: profileSeeder.userId,
    description: 'description',
    startRegistrationDate: new Date(),
    endRegistrationDate: addMonths(new Date(), 1),
    status: 'WAITING_FOR_PLAYERS',
    title: 'Event 2',
  },
  {
    bannerImageUrl: 'image-url',
    profileUserId: profileSeeder.userId,
    description: 'description',
    startRegistrationDate: new Date(),
    endRegistrationDate: addMonths(new Date(), 1),
    status: 'WAITING_FOR_PLAYERS',
    title: 'Event 3',
  },
  {
    bannerImageUrl: 'image-url',
    profileUserId: profileSeeder.userId,
    description: 'description',
    startRegistrationDate: new Date(),
    endRegistrationDate: addMonths(new Date(), 1),
    status: 'WAITING_FOR_PLAYERS',
    title: 'Event 4',
  },
  {
    bannerImageUrl: 'image-url',
    profileUserId: profileSeeder.userId,
    description: 'description',
    startRegistrationDate: new Date(),
    endRegistrationDate: addMonths(new Date(), 1),
    status: 'WAITING_FOR_PLAYERS',
    title: 'Event 5',
  },
];
