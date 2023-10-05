import { MlbbRole } from '@v6/db';
import * as z from 'zod';

export const editProfileFormSchema = z.object({
  displayName: z.string().min(3).max(20),
  mlbbUserId: z.string().min(4).max(16),
  mlbbServerId: z.string().min(2).max(7),
  mlbbRole: z.nativeEnum(MlbbRole),
});

export type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>;
