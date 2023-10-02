import { MlbbRole } from '@v6/db';

export const mlbbRoleEnumToText = (role?: MlbbRole | null) => {
  switch (role) {
    case 'EXP':
      return 'Exp Laner';
    case 'GOLD':
      return 'Gold Laner';
    case 'JUNGLE':
      return 'Jungler';
    case 'MID':
      return 'Mid Laner';
    case 'ROAM':
      return 'Roamer';
    default:
      return 'Not set';
  }
};
