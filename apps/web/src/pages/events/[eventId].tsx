import { GetServerSideProps } from 'next';
import { getEventById } from '@v6/api';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { axios } from '~/lib/axios';

interface EventDetailProps {
  title: string;
  // description: string;
  // displayName: string;
  // username: string;
  // profilePictureUrl: string;
  // playersJoined: number;
  // totalMatches: number;
  // id: number;
}

const EventDetail: React.FC<EventDetailProps> = ({ title }) => {
  return (
    <>
      <HeadMetaData />
      <main className="container">
        <h1 className="text-3xl font-semibold">{title}</h1>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  EventDetailProps,
  { eventId: string }
> = async ({ params }) => {
  const { data: event } = await getEventById(parseInt(params!.eventId), {
    axios,
  });

  if (!event) {
    return {
      notFound: true,
    };
  }

  const {
    creator,
    description,
    livestreamUrl,
    startLiveDate,
    startRegistrationDate,
    status,
    title,
    totalMatches,
    EventTeam,
    EventRegistration,
  } = event;

  return {
    props: {
      title,
    },
  };
};

export default EventDetail;
