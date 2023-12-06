import { useContext, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useRemoveRegisteredPlayerMutation } from '@v6/api';
import { MlbbRole } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Button, buttonVariants } from '~/components/ui/button';
import { queryClient } from '~/lib/react-query';
import { EventContext } from '../context/event';

type PlayersListItemProps = {
  mlbbUsername: string;
  role: MlbbRole;
  playerId: string;
};

export const PlayersListItem: React.FC<PlayersListItemProps> = ({
  mlbbUsername,
  role,
  playerId,
}) => {
  const eventContext = useContext(EventContext);

  const [dialogIsOpened, setDialogIsOpened] = useState<boolean>(false);

  const {
    mutate: removePlayer,
    isPending,
    variables,
  } = useRemoveRegisteredPlayerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['registered-players', { eventId: eventContext.eventId }],
      });
    },
  });

  return (
    <>
      <div className="col-span-full flex justify-between rounded-md bg-secondary px-3 py-1.5 text-sm md:col-span-1">
        <p>{mlbbUsername}</p>
        <div className="flex gap-4">
          <p className="text-muted-foreground">{mlbbRoleEnumToText(role)}</p>
          {eventContext.isOwner && (
            <Button
              size="icon"
              className="h-5 w-5 rounded-full"
              variant="secondary"
              onClick={() => setDialogIsOpened(true)}
            >
              <Cross1Icon className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <AlertDialog onOpenChange={setDialogIsOpened} open={dialogIsOpened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove player?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => {
                removePlayer({
                  eventId: eventContext.eventId as number,
                  playerId,
                });
              }}
              disabled={isPending && variables.playerId === playerId}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
