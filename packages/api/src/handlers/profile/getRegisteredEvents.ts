import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import { GetRegisteredEvents } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';
import { SetOptional } from 'type-fest';

import { ApiFn, ExtractFnReturnType, QueryConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';
import { PageableResponse } from '../../types/pagination';

const userRegisteredEvents =
  Prisma.validator<Prisma.EventRegistrationDefaultArgs>()({
    include: {
      event: {
        include: {
          creator: true,
          _count: {
            select: {
              EventRegistration: true,
            },
          },
        },
      },
    },
  });

export type UserRegisteredEvents = Prisma.EventRegistrationGetPayload<
  typeof userRegisteredEvents
>;

export const getRegisteredEvents: ApiFn<
  GetRegisteredEvents,
  AxiosPromise<PageableResponse<UserRegisteredEvents>>
> = ({ limit = 10, page = 1 }, { axios = defaultAxios }) => {
  return axios.get('/profiles/event-registrations', {
    params: {
      limit,
      page,
    },
  });
};

type UseGetRegisteredEventsOptions = {
  options?: SetOptional<
    UseQueryOptions<
      unknown,
      unknown,
      PageableResponse<UserRegisteredEvents>,
      any[]
    >,
    'queryKey'
  >;
  query: GetRegisteredEvents;
};

export const useGetRegisteredEventsQuery = ({
  options,
  query,
}: UseGetRegisteredEventsOptions) => {
  const { axios, api } = useApiClient();

  return useQuery({
    queryKey: ['profile', 'registered-events'],
    queryFn: async () => {
      return await api(getRegisteredEvents(query, { axios }));
    },
    ...options,
  });
};
