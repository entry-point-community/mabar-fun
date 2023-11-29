import { useMutation } from '@tanstack/react-query';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

type DeletePlayerDTO = { teamId: number; playerId: string };

export const deletePlayerFromTeam: ApiFn<
  DeletePlayerDTO,
  AxiosPromise<undefined>
> = (deletePlayerDTO, { axios = defaultAxios }) => {
  const { playerId, teamId } = deletePlayerDTO;

  return axios.delete(`/teams/${teamId}/players/${playerId}`);
};

type MutationFnType = typeof deletePlayerFromTeam;

export const useDeletePlayerFromTeamMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: ['delete-player'],
    mutationFn: (body) => {
      return deletePlayerFromTeam(body, { axios });
    },
    ...config,
  });
};
