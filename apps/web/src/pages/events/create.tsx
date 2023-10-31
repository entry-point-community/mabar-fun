import { useRouter } from 'next/router';
import { CreateEventErrors, useCreateTeamForEventMutation } from '@v6/api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { CreateEventInner } from '~/features/events/create-event/components';

const CreateEventPage = () => {
  const router = useRouter();

  const { mutate } = useCreateTeamForEventMutation({
    onSuccess: () => {
      toast.success('Berhasil membuat event');
      router.push('/events');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        if (
          err.response?.data.errors.includes(CreateEventErrors.NOT_A_CREATOR)
        ) {
          toast.error('Pembuatan event gagal. Kamu bukan seorang creator.');
          return;
        }

        toast.error(err.response?.data.errors.join(' '));
      }
    },
  });

  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        <h1 className="mb-4 text-2xl font-semibold">Schedule event</h1>

        <CreateEventInner onSubmit={mutate} />
      </main>
    </>
  );
};

export default CreateEventPage;
