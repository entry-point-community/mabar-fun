import { useEffect, useState } from 'react';
import { useGetMlbbAccountUsernameQuery } from '@v6/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

type UseVerifyMlbbAccountParams = {
  mlbbUserId: string;
  mlbbServerId: string;
};

export const useVerifyMlbbAccount = ({
  mlbbServerId,
  mlbbUserId,
}: UseVerifyMlbbAccountParams) => {
  const [hasVerifiedAccount, setHasVerifiedAccount] = useState<boolean>(false);

  const {
    refetch: refetchMlbbAccountUsername,
    data: mlbbAccountUsernameResult,
  } = useGetMlbbAccountUsernameQuery({
    query: {
      mlbbServerId,
      mlbbUserId,
    },
    config: {
      enabled: false,
    },
  });

  const fetchMlbbAccountUsername = async () => {
    try {
      const { data: mlbbAccountUsername, error } =
        await refetchMlbbAccountUsername();

      if (error) throw error;

      if (mlbbAccountUsername?.data) {
        toast.success(
          'Berhasil mendapatkan username: ' + mlbbAccountUsername.data,
        );
        setHasVerifiedAccount(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        if (err.response?.status === 422) {
          toast.error('User ID atau Zone ID salah');
          return;
        }

        toast.error(err.response?.data.errors[0]);
        return;
      }
    }
  };

  // force user to reverify if they try to edit form again
  useEffect(() => {
    setHasVerifiedAccount(false);
  }, [mlbbServerId, mlbbUserId]);

  return {
    fetchMlbbAccountUsername,
    setHasVerifiedAccount,
    hasVerifiedAccount,
    mlbbAccountUsername: mlbbAccountUsernameResult?.data,
  };
};
