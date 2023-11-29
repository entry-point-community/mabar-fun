import { useMutation } from '@tanstack/react-query';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const deleteTeam: ApiFn<{ teamId: number }, AxiosPromise<undefined>> = (
  deletePlayerDTO,
  { axios = defaultAxios },
) => {
  const { teamId } = deletePlayerDTO;

  return axios.delete(`/teams/${teamId}`);
};

type MutationFnType = typeof deleteTeam;

export const useDeleteTeamMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: ['delete-team'],
    mutationFn: (body) => {
      return deleteTeam(body, { axios });
    },
    ...config,
  });
};
