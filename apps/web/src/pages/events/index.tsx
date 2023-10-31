import { useGetEventsQuery } from '@v6/api';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { EventCard } from '~/features/events/components';

const EventsPage = () => {
  const eventsQuery = useGetEventsQuery({ limit: 10 });

  return (
    <>
      <HeadMetaData title="Events" />
      <main className="min-h-screen max-w-screen-md sm:container">
        <section className="mt-10 flex flex-col gap-8 px-4">
          <div className="items-center gap-4">
            <Tabs>
              <TabsList className="gap-2">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger disabled value="following">
                  Following
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Event Card */}
          <div className="grid grid-cols-1 gap-12 md:gap-6 xl:grid-cols-2">
            {eventsQuery.data?.records?.map((event) => {
              return (
                <EventCard
                  key={event.id}
                  description={event.description}
                  title={event.title}
                  displayName={event.creator.displayName as string}
                  username={event.creator.mlbbUsername as string}
                  playersJoined={event._count.EventRegistration}
                  totalMatches={event.totalMatches}
                  profilePictureUrl={event.creator.profilePictureUrl || ''}
                  maxPlayers={event.maxPlayers}
                  id={event.id}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default EventsPage;
