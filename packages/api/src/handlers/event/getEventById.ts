import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';
import { SetOptional } from 'type-fest';

import { ApiFn } from '../../lib/react-query';
import { useApiClient } from '../../providers';

const eventWithDetails = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    creator: true,
    EventRegistration: {
      include: {
        player: true,
      },
    },
    EventTeam: {
      include: {
        EventTeamPlayer: {
          include: {
            player: true,
          },
        },
      },
    },
  },
});

export type EventWithDetails = Prisma.EventGetPayload<typeof eventWithDetails>;

export const getEventById: ApiFn<number, AxiosPromise<EventWithDetails>> = (
  eventId,
  { axios = defaultAxios },
) => {
  return axios.get(`/events/${eventId}`);
};

export const useGetEventByIdQuery = (
  eventId: number,
  options?: SetOptional<
    UseQueryOptions<unknown, unknown, EventWithDetails, any[]>,
    'queryKey'
  >,
) => {
  const { axios, api } = useApiClient();

  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const events = await api(getEventById(eventId, { axios }));

      return events;
    },
    ...options,
  });
};
