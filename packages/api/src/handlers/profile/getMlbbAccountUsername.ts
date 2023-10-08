import { useQuery } from '@tanstack/react-query';
import { GetMlbbAccountDTO } from '@v6/dto';
import defaultAxios, { AxiosPromise } from 'axios';

import { ApiFn, ExtractFnReturnType, QueryConfig } from '../../lib/react-query';
import { useApiClient } from '../../providers';

export const getMlbbAccountUsername: ApiFn<
  GetMlbbAccountDTO,
  AxiosPromise<string>
> = ({ mlbbServerId, mlbbUserId }, { axios = defaultAxios }) => {
  return axios.get('/profiles/mlbb-account', {
    params: {
      mlbbUserId,
      mlbbServerId,
    },
  });
};

type QueryFnType = typeof getMlbbAccountUsername;

type UseMlbbAccountUsernameQueryOptions = {
  config?: QueryConfig<QueryFnType>;
  query: GetMlbbAccountDTO;
};

export const useGetMlbbAccountUsernameQuery = ({
  config,
  query,
}: UseMlbbAccountUsernameQueryOptions) => {
  const { axios } = useApiClient();

  return useQuery<ExtractFnReturnType<QueryFnType>>({
    queryKey: ['mlbb-account'],
    queryFn: () => getMlbbAccountUsername(query, { axios }),
    ...config,
  });
};
