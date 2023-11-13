import { PropsWithChildren, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useGetProfileQuery } from '@v6/api';

export const OnboardingProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const user = useUser();

  const { data: profile, isFetching } = useGetProfileQuery({});

  // if user does not have MLBB username, redirect to onboarding page
  useEffect(() => {
    if (!profile?.data.mlbbUsername && !isFetching && user) {
      router.replace('/onboarding');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, router.asPath, isFetching]);

  return children;
};
