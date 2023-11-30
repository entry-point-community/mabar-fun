import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useEditProfileMutation, useGetProfileQuery } from '@v6/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { EditProfileFormInner } from '~/features/profile/components';
import { EditProfileFormSchema } from '~/features/profile/forms/edit-profile';
import { queryClient } from '~/lib/react-query';

const OnboardingPage = () => {
  const router = useRouter();

  const { data: profile } = useGetProfileQuery({});
  const { mutateAsync: editProfileMutate } = useEditProfileMutation({
    onSuccess: () => {
      toast.success('Berhasil update profile');

      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });

      router.replace('/');
    },
    onError: (error) => {
      if (error.isAxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        toast.error(err.response?.data.errors[0]);
        return;
      }
    },
  });

  const handleEditProfileSubmit = async (
    values: EditProfileFormSchema & { profilePictureFile?: File },
  ) => {
    await editProfileMutate(values);
  };

  // if user already has MLBB profile data, skip onboarding
  useEffect(() => {
    if (profile?.data.mlbbUsername) {
      router.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <>
      <HeadMetaData />
      <main className="container flex min-h-screen max-w-screen-md flex-col">
        <h1 className="mx-auto mb-10 max-w-md text-center font-heading text-4xl font-semibold">
          Lengkapin profile kamu dulu sebelum lanjut ya
        </h1>
        <EditProfileFormInner onSubmit={handleEditProfileSubmit} />
      </main>
    </>
  );
};

export default OnboardingPage;
