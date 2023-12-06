import { createContext } from 'react';

type EventContext = {
  eventId: number | null;
  isOwner: boolean;
};

export const EventContext = createContext<EventContext>({
  eventId: null,
  isOwner: false,
});
