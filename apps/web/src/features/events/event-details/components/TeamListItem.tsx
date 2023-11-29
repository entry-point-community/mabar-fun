import { useState } from 'react';
import { Cross1Icon, PlusIcon } from '@radix-ui/react-icons';
import {
  useDeletePlayerFromTeamMutation,
  useGetPlayersFromEventQuery,
} from '@v6/api';
import { Prisma } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
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

  const { data: registeredPlayers } = useGetPlayersFromEventQuery({
    eventId,
  });
  const { mutate, variables, isPending } = useDeletePlayerFromTeamMutation({
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
                  isPending &&
                  variables.playerId === player.profileUserId &&
                  player.eventTeamId === variables.teamId
                }
                onClick={() =>
                  mutate({ playerId: player.profileUserId, teamId: id })
                }
              >
                <Cross1Icon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}

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
