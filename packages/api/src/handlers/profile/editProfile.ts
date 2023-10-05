import { useMutation } from '@tanstack/react-query';
import { Profile } from '@v6/db';
import { EditProfileDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, MutationConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

type EditProfileDTOWithFile = EditProfileDTO & { profilePictureFile?: File };

export const editProfile: ApiFn<
  EditProfileDTOWithFile,
  AxiosPromise<Profile>
> = (editProfileDTO, { axios = defaultAxios }) => {
  const {
    displayName,
    mlbbRole,
    mlbbServerId,
    mlbbUserId,
    profilePictureFile,
  } = editProfileDTO;

  const editProfileFormData = new FormData();

  if (displayName) {
    editProfileFormData.append('displayName', displayName);
  }

  if (mlbbRole) {
    editProfileFormData.append('mlbbRole', mlbbRole);
  }

  if (mlbbServerId) {
    editProfileFormData.append('mlbbServerId', mlbbServerId);
  }

  if (mlbbUserId) {
    editProfileFormData.append('mlbbUserId', mlbbUserId);
  }

  if (profilePictureFile) {
    editProfileFormData.append('profile-picture', profilePictureFile);
  }

  return axios.patch('/profiles', editProfileFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type MutationFnType = typeof editProfile;

export const useEditProfileMutation = (
  config: MutationConfig<MutationFnType> = {},
) => {
  const { axios } = useApiClient();

  return useMutation({
    mutationKey: [''],
    mutationFn: (body) => editProfile(body, { axios }),
    ...config,
  });
};
