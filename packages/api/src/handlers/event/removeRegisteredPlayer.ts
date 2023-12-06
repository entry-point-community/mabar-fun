import { useMutation } from '@tanstack/react-query';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

type RemoveRegisteredPlayerDTO = { eventId: number; playerId: string };

export const removeRegisteredPlayer: ApiFn<
  RemoveRegisteredPlayerDTO,
  AxiosPromise<undefined>
> = (deletePlayerDTO, { axios = defaultAxios }) => {
  const { playerId, eventId } = deletePlayerDTO;

  return axios.delete(`/events/${eventId}/players/${playerId}`);
};

type MutationFnType = typeof removeRegisteredPlayer;

export const useRemoveRegisteredPlayerMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: ['remove-player-event'],
    mutationFn: (body) => {
      return removeRegisteredPlayer(body, { axios });
    },
    ...config,
  });
};
