import { useMutation } from '@tanstack/react-query';
import { EventTeamPlayer, Profile } from '@v6/db';
import { AddPlayerToTeamDTO, EditProfileDTO, RegisterEventDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const addPlayerToTeam: ApiFn<
  AddPlayerToTeamDTO & { teamId: number },
  AxiosPromise<EventTeamPlayer>
> = (addPlayerDTO, { axios = defaultAxios }) => {
  const { mlbbRole, playerId, teamId } = addPlayerDTO;

  return axios.post(`/teams/${teamId}/players`, {
    mlbbRole,
    playerId,
  });
};

type MutationFnType = typeof addPlayerToTeam;

export const useAddPlayerToTeamMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: [''],
    mutationFn: (body) => addPlayerToTeam(body, { axios }),
    ...config,
  });
};

export enum AddPlayerToTeamErrors {
  ALREADY_REGISTERED = 'player already registered to this team',
}
