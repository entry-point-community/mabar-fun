import { useGetRegisteredEventsQuery } from '@v6/api';

import { EventCard } from '~/features/events/components';

export const RegisteredEventsList = () => {
  const { data } = useGetRegisteredEventsQuery({
    query: {},
  });

  return (
    <div>
      <h1>Registered Events List</h1>
      <div className="grid grid-cols-1 gap-12 md:gap-6 xl:grid-cols-2">
        {data?.records.map((val) => {
          return (
            <EventCard
              username={val.event.creator.mlbbUsername as string}
              profilePictureUrl={val.event.creator.profilePictureUrl as string}
              playersJoined={val.event._count.EventRegistration}
              displayName={val.event.creator.displayName as string}
              {...val.event}
              key={val.eventId}
            />
          );
        })}
      </div>
    </div>
  );
};
