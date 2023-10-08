import { useLayoutEffect } from 'react';
import { useRouter } from 'next/router';

import { useStore } from '~/store';

export const useAuthenticatedRoute = () => {
  const { user } = useStore();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!user) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router.isReady]);
};
