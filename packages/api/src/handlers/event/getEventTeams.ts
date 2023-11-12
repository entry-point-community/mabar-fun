import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn } from '../../lib/react-query';
import { useApiClient } from '../../providers';

const eventTeams = Prisma.validator<Prisma.EventTeamDefaultArgs>()({
  include: {
    EventTeamPlayer: {
      include: {
        player: true,
      },
    },
  },
});

export type EventTeams = Prisma.EventTeamGetPayload<typeof eventTeams>;

export const getEventTeams: ApiFn<number, AxiosPromise<EventTeams[]>> = (
  eventId,
  { axios = defaultAxios },
) => {
  return axios.get(`/events/${eventId}/teams`);
};

export const useGetEventTeamsQuery = (
  eventId: number,
  options?: Omit<
    UseQueryOptions<unknown, unknown, EventTeams[], any[]>,
    'queryKey'
  >,
) => {
  const { axios, api } = useApiClient();

  return useQuery({
    ...options,
    queryKey: ['event-teams', eventId],
    queryFn: async () => {
      const eventTeams = await api(getEventTeams(eventId, { axios }));

      return eventTeams;
    },
  });
};
