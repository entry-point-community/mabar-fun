import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';

export const profileSeeder: Prisma.ProfileCreateInput = {
  userId: '36d23b5f-241d-40b0-96c0-065a6b2a6638',
  displayName: faker.person.fullName(),
  mlbbUserId: faker.string.numeric({ length: 8 }),
  mlbbServerId: faker.string.numeric({ length: 4 }),
  // mlbbUsername: 'testing 123',
};

export const eventSeeder: Prisma.EventCreateInput = {
  description: 'description',
  startRegistrationDate: new Date(),
  endRegistrationDate: addMonths(new Date(), 1),
  title: 'Event 1',
  creator: {
    connectOrCreate: {
      where: { userId: profileSeeder.userId },
      create: {
        ...profileSeeder,
      },
    },
  },
};
