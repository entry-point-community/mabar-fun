import { useQuery } from '@tanstack/react-query';
import { Prisma } from '@v6/db';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, ExtractFnReturnType, QueryConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

const profileWithFavoriteHeroes = Prisma.validator<Prisma.ProfileDefaultArgs>()(
  {
    include: {
      ProfileHero: {
        include: {
          hero: true,
        },
      },
    },
  },
);

export type ProfileWithFavoriteHeroes = Prisma.ProfileGetPayload<
  typeof profileWithFavoriteHeroes
>;

export const getProfile: ApiFn<{}, AxiosPromise<ProfileWithFavoriteHeroes>> = (
  {},
  { axios = defaultAxios },
) => {
  return axios.get('/profiles');
};

type QueryFnType = typeof getProfile;

type UseGetProfileQueryOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useGetProfileQuery = ({ config }: UseGetProfileQueryOptions) => {
  const { axios } = useApiClient();

  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['profile'],
    queryFn: () => getProfile({}, { axios }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...config,
  });
};
