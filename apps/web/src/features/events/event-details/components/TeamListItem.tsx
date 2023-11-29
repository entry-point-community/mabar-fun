import { useState } from 'react';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  useDeletePlayerFromTeamMutation,
  useDeleteTeamMutation,
  useGetPlayersFromEventQuery,
} from '@v6/api';
import { Prisma } from '@v6/db';

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
import { Badge } from '~/components/ui/badge';
import { Button, buttonVariants } from '~/components/ui/button';
import { queryClient } from '~/lib/react-query';
import { AddPlayerSheet } from './AddPlayerSheet';

type TeamListItemProps = {
  id: number;
  teamPlayers: Prisma.EventTeamPlayerGetPayload<{
    include: {
      player: true;
    };
  }>[];
  isOwner: boolean;
  eventId: number;
};

export const TeamListItem: React.FC<TeamListItemProps> = ({
  id,
  teamPlayers,
  isOwner,
  eventId,
}) => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const [dialogIsOpened, setDialogIsOpened] = useState<boolean>(false);

  const { data: registeredPlayers } = useGetPlayersFromEventQuery({
    eventId,
  });
  const {
    mutate: deletePlayerFromTeam,
    variables: deletePlayerFromTeamVariables,
    isPending: deletePlayerFromTeamIsPending,
  } = useDeletePlayerFromTeamMutation({
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-teams', Number(eventId)],
      });
    },
  });
  const {
    mutate: deleteTeam,
    variables: deleteTeamVariables,
    isPending: deleteTeamIsPending,
  } = useDeleteTeamMutation({
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['event-teams', Number(eventId)],
      });
    },
  });

  return (
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="font-semibold text-muted-foreground">Team {id}</h5>
        {isOwner && (
          <>
            {/* <Button size="sm" className="hidden md:inline-flex">
              Tambah player <PlusIcon className="ml-2" />
            </Button> */}
            <Button onClick={() => setSheetOpened(true)} size="sm">
              Tambah player <PlusIcon className="ml-2" />
            </Button>
          </>
        )}
      </div>
      {teamPlayers.map((player) => {
        return (
          <div
            className="mb-1 flex justify-between text-sm"
            key={player.profileUserId}
          >
            {player.player.mlbbUsername}
            <div className="flex gap-2">
              <Badge variant="outline">{mlbbRoleEnumToText(player.role)}</Badge>
              <Button
                size="icon"
                className="h-5 w-5 rounded-full"
                variant="secondary"
                disabled={
                  deletePlayerFromTeamIsPending &&
                  deletePlayerFromTeamVariables.playerId ===
                    player.profileUserId &&
                  player.eventTeamId === deletePlayerFromTeamVariables.teamId
                }
                onClick={() =>
                  deletePlayerFromTeam({
                    playerId: player.profileUserId,
                    teamId: id,
                  })
                }
              >
                <Cross1Icon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        onClick={() => {
          setDialogIsOpened(true);
        }}
        disabled={deleteTeamVariables?.teamId === id && deleteTeamIsPending}
        variant="destructive"
        size="sm"
        className="mt-4"
      >
        Delete team
      </Button>

      {/* TODO: Refactor me */}
      <AlertDialog
        open={dialogIsOpened}
        onOpenChange={(opened) => setDialogIsOpened(opened)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apa kamu yakin ingin delete team?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={() => {
                deleteTeam({ teamId: id });
              }}
              disabled={
                deleteTeamVariables?.teamId === id && deleteTeamIsPending
              }
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddPlayerSheet
        eventId={eventId}
        teamId={id}
        setSheetOpened={setSheetOpened}
        sheetOpened={sheetOpened}
        registeredPlayers={registeredPlayers || []}
      />
    </div>
  );
};
