import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import { GetEventsDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn } from '../../lib/react-query';
import { useApiClient } from '../../providers';
import { PageableResponse } from '../../types/pagination';

const eventsWithPlayerCount = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: {
    creator: true,
    _count: {
      select: {
        EventRegistration: true,
      },
    },
  },
});

export type EventsWithPlayerCount = Prisma.EventGetPayload<
  typeof eventsWithPlayerCount
>;

export const getEvents: ApiFn<
  GetEventsDTO,
  AxiosPromise<PageableResponse<EventsWithPlayerCount>>
> = (query = {}, { axios = defaultAxios }) => {
  return axios.get('/events', {
    params: query,
  });
};

export const useGetEventsQuery = (
  query?: GetEventsDTO,
  options?: UseQueryOptions<
    unknown,
    unknown,
    PageableResponse<EventsWithPlayerCount>,
    any[]
  >,
) => {
  const { axios, api } = useApiClient();

  return useQuery(
    ['events', query],
    async () => {
      const events = await api(getEvents(query || {}, { axios }));

      return events;
    },
    options,
  );
};
