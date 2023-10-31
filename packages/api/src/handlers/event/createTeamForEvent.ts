import { useMutation } from '@tanstack/react-query';
import { EventTeam } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const createTeamForEvent: ApiFn<
  { eventId: number },
  AxiosPromise<EventTeam>
> = ({ eventId }, { axios = defaultAxios }) => {
  return axios.post(`/events/${eventId}/teams`, { eventId });
};

type MutationFnType = typeof createTeamForEvent;

export const useCreateTeamForEventMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => createTeamForEvent(body, { axios }),
    ...config,
  });
};
