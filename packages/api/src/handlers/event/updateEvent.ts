import { useMutation } from '@tanstack/react-query';
import { Event } from '@v6/db';
import { UpdateEventDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const updateEvent: ApiFn<
  UpdateEventDTO & { eventId: number },
  AxiosPromise<Event>
> = (updateEventDTO, { axios = defaultAxios }) => {
  return axios.patch(`/events/${updateEventDTO.eventId}`, updateEventDTO);
};

type MutationFnType = typeof updateEvent;

export const useUpdateEventMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => updateEvent(body, { axios }),
    ...config,
  });
};
