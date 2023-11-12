import {
  DefaultOptions,
  QueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError, AxiosInstance, AxiosPromise } from 'axios';
import { AsyncReturnType } from 'type-fest';

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  // queryCache: new QueryCache({
  //   onError: (error) => {
  //     if (error instanceof AxiosError) {
  //       const err = error as AxiosError;

  //       if (err.response && err.response.status >= 500) {
  //         toast.error('Server error');
  //         return;
  //       }
  //     }

  //     toast.error('Something went wrong');
  //   },
  // }),
});

export type ExtractFnReturnType<FnType extends (...args: any) => any> =
  AsyncReturnType<FnType>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError,
    Parameters<MutationFnType>[0]
  >;

export type ApiFnOptions = {
  axios?: AxiosInstance;
};

export type ApiFn<ParamsType, ResponseType extends AxiosPromise> = (
  params: ParamsType,
  config: ApiFnOptions,
) => ResponseType;
