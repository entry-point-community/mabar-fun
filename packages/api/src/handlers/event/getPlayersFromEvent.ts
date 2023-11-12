import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn } from '../../lib/react-query';
import { useApiClient } from '../../providers';

const registeredPlayer =
  Prisma.validator<Prisma.EventRegistrationDefaultArgs>()({
    include: {
      player: {
        include: {
          EventTeamPlayer: true,
        },
      },
    },
  });

export type RegisteredPlayer = Prisma.EventRegistrationGetPayload<
  typeof registeredPlayer
>;

export const getPlayersFromEvent: ApiFn<
  { eventId: number },
  AxiosPromise<RegisteredPlayer[]>
> = ({ eventId }, { axios = defaultAxios }) => {
  return axios.get(`/events/${eventId}/players`);
};

export const useGetPlayersFromEventQuery = (
  query: { eventId: number },
  options?: UseQueryOptions<unknown, unknown, RegisteredPlayer[], any[]>,
) => {
  const { axios, api } = useApiClient();

  return useQuery({
    queryKey: ['registered-players', query],
    queryFn: async () => {
      const registeredPlayers = await api(
        getPlayersFromEvent(query, { axios }),
      );

      return registeredPlayers;
    },
    ...options,
  });
};
