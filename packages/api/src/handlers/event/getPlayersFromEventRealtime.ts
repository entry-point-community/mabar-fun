import { useEffect } from 'react';
import { EventRegistration } from '@v6/db';
import {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  supabaseClient,
} from '@v6/supabase/nextjs';

type RealtimeCallbackFn<T extends object> = (
  payload: RealtimePostgresInsertPayload<T> | RealtimePostgresDeletePayload<T>,
) => void;

export const useGetPlayersFromEventRealtime = (
  eventId: number,
  callback: RealtimeCallbackFn<EventRegistration>,
) => {
  useEffect(() => {
    const channel = supabaseClient
      .channel('postgres-schema-changes')
      .on<EventRegistration>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'EventRegistration',
          filter: 'eventId=eq.' + eventId,
        },
        callback,
      )
      .on<EventRegistration>(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'EventRegistration',
          filter: 'eventId=eq.' + eventId,
        },
        callback,
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);
};
