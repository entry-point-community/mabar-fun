import * as z from 'zod';

export const createEventFormSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Judul minimal 3 karakter')
      .max(100, 'Judul maksimal 100 karakter'),
    description: z
      .string()
      .min(0)
      .max(1000, 'Deskripsi maksimal 1000 karakter'),
    maxPlayers: z
      .number()
      .min(1, 'Minimal 1 player')
      .max(150, 'Maksimal 150 player')
      .transform((maxPlayer) => Number(maxPlayer)),
    startRegistrationDate: z
      .date()
      .min((new Date()).setHours(0,0,0,0), 'Tanggal tidak bisa sebelum hari ini'),
    endRegistrationDate: z
      .date()
      .min((new Date()).setHours(0,0,0,0), 'Tanggal tidak bisa sebelum hari ini'),
  })
  .refine((data) => data.startRegistrationDate < data.endRegistrationDate, {
    path: ['endRegistrationDate'],
    message: 'Tanggal tutup tidak bisa sebelum tanggal buka',
  });

export type CreateEventFormSchema = z.infer<typeof createEventFormSchema>;
