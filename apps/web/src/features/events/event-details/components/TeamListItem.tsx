import { useState } from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { useGetPlayersFromEventQuery } from '@v6/api';
import { Prisma } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
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
            <Badge variant="outline">{mlbbRoleEnumToText(player.role)}</Badge>
          </div>
        );
      })}

      <AddPlayerSheet
        teamId={id}
        setSheetOpened={setSheetOpened}
        sheetOpened={sheetOpened}
        registeredPlayers={registeredPlayers || []}
      />
    </div>
  );
};
