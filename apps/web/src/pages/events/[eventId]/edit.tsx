import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { EventWithDetails, getEventById } from '@v6/api';
import { supabaseServerClient } from '@v6/supabase/nextjs';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { CreateEventInner } from '~/features/events/create-event/components';
import { axios } from '~/lib/axios';

type EditEventProps = {
  event: EventWithDetails;
};

const EditEvent: React.FC<EditEventProps> = ({ event }) => {
  const router = useRouter();

  return (
    <>
      <HeadMetaData />
      <main className="container min-h-screen max-w-screen-md">
        <h1 className="mb-4 text-2xl font-semibold">Edit Event</h1>

        <CreateEventInner
          defaultValues={{
            description: event.description,
            endRegistrationDate: new Date(event.endRegistrationDate),
            maxPlayers: event.maxPlayers || 0,
            startRegistrationDate: new Date(event.startRegistrationDate),
            title: event.title,
          }}
        />
      </main>
    </>
  );
};

export default EditEvent;

export const getServerSideProps: GetServerSideProps<EditEventProps> = async (
  context,
) => {
  if (!context.params?.eventId)
    return {
      notFound: true,
    };

  const { data: event } = await getEventById(Number(context.params.eventId), {
    axios,
  });

  const supabase = supabaseServerClient(context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (event.profileUserId !== user?.id || !user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
};
