import { useMutation } from '@tanstack/react-query';
import { Profile } from '@v6/db';
import { EditProfileDTO, RegisterEventDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const registerEvent: ApiFn<
  RegisterEventDTO & { eventId: number },
  AxiosPromise<undefined>
> = (registerEventDTO, { axios = defaultAxios }) => {
  const { mlbbRole, eventId } = registerEventDTO;

  return axios.post(`/events/${eventId}/event-registrations`, {
    mlbbRole,
  });
};

type MutationFnType = typeof registerEvent;

export const useRegisterEventMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: [''],
    mutationFn: (body) => registerEvent(body, { axios }),
    ...config,
  });
};

export enum RegisterEventErrors {
  OWNED_EVENT = 'unable to join owned event',
  ALREADY_REGISTERED = 'user has already been registered to the event',
  PAST_REGISTRATION = 'registration window has passed',
  BEFORE_REGISTRATION = 'registration is not opened yet',
  NO_USERNAME = 'user has no MLBB username',
}
