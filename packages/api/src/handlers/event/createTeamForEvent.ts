import { useMutation } from '@tanstack/react-query';
import { EventTeam } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const createTeamForTeamForEvent: ApiFn<
  { eventId: number },
  AxiosPromise<EventTeam>
> = ({ eventId }, { axios = defaultAxios }) => {
  return axios.post(`/events/${eventId}/teams`, { eventId });
};

type MutationFnType = typeof createTeamForTeamForEvent;

export const useCreateTeamForTeamForEventMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => createTeamForTeamForEvent(body, { axios }),
    ...config,
  });
};
