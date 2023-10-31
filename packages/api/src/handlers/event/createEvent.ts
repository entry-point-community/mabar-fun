import { useMutation } from '@tanstack/react-query';
import { Event } from '@v6/db';
import { CreateEventDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const createEvent: ApiFn<CreateEventDTO, AxiosPromise<Event>> = (
  createEventDTO,
  { axios = defaultAxios },
) => {
  return axios.post(`/events`, createEventDTO);
};

type MutationFnType = typeof createEvent;

export const useCreateEventMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationFn: (body) => createEvent(body, { axios }),
    ...config,
  });
};

export enum CreateEventErrors {
  NOT_A_CREATOR = 'user is not a creator',
}
