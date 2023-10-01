import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useStore } from '~/store';

export const useGuestRoute = () => {
  const { user } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
