import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

export const userSeeder: Prisma.ProfileCreateInput = {
  userId: 'a9a14869-250a-422b-bc73-cdc051edd9eb',
  displayName: faker.person.fullName(),
  mlbbUserId: faker.string.numeric({ length: 8 }),
  mlbbServerId: faker.string.numeric({ length: 4 }),
  mlbbUsername: faker.person.firstName(),
};

export const creatorSeeder: Prisma.ProfileCreateInput = {
  userId: '93166758-6aaa-4e95-b1c5-31b0d2b850f1',
  isCreator: true,
  displayName: faker.person.fullName(),
  mlbbUserId: faker.string.numeric({ length: 8 }),
  mlbbServerId: faker.string.numeric({ length: 4 }),
  mlbbUsername: faker.person.firstName(),
};
