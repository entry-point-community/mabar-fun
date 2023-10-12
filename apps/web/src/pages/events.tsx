import { useGetEventsQuery } from '@v6/api';

import { HeadMetaData } from '~/components/meta/HeadMetaData';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { EventCard } from '~/features/events/components';

const EventsPage = () => {
  const eventsQuery = useGetEventsQuery({ limit: 10 });

  return (
    <>
      <HeadMetaData title="Events" />
      <main className="max-w-screen-md sm:container">
        <div className=" flex flex-col items-center gap-6 md:gap-10">
          <h1 className="max-w-screen-md text-center font-heading text-3xl font-semibold md:text-5xl">
            Join event mabar bareng creator pilihan lo.
          </h1>
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Button className="self-center">🔴 Live Sekarang</Button>
            <p className="text-sm">atau</p>
            <Button variant="outline">Event Mendatang</Button>
          </div>
        </div>

        <section className="mt-20 flex flex-col gap-4  px-4">
          <div className="flex items-center gap-4">
            <h3 className="shrink-0 font-heading text-xl font-semibold">
              Recommended
            </h3>
            <Separator className="shrink" />
          </div>

          {/* Event Card */}
          <div className="grid grid-cols-1 gap-12 md:gap-6 lg:grid-cols-2">
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
