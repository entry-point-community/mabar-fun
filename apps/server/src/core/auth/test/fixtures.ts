import { Prisma } from '@prisma/client';

export const userSeeder: Prisma.ProfileCreateInput = {
  userId: 'a9a14869-250a-422b-bc73-cdc051edd9eb',
};

export const creatorSeeder: Prisma.ProfileCreateInput = {
  userId: '93166758-6aaa-4e95-b1c5-31b0d2b850f1',
  isCreator: true,
};
