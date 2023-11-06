import { useState } from 'react';
import { PlusIcon, ShuffleIcon } from '@radix-ui/react-icons';
import { useGetPlayersFromEventQuery } from '@v6/api';
import { MlbbRole, Prisma } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

type TeamListItemProps = {
  id: number;
  players: Prisma.EventTeamPlayerGetPayload<{
    include: {
      player: true;
    };
  }>[];
  isOwner: boolean;
  eventId: number;
};

export const TeamListItem: React.FC<TeamListItemProps> = ({
  id,
  players,
  isOwner,
  eventId,
}) => {
  const [sheetOpened, setSheetOpened] = useState<boolean>(false);
  const [searchRole, setSearchRole] = useState<MlbbRole>(MlbbRole.EXP);

  const { data: registeredPlayers } = useGetPlayersFromEventQuery({
    eventId,
  });

  return (
    <div className="rounded-md border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="font-semibold text-muted-foreground">Team {id}</h5>
        {isOwner && (
          <>
            <Button size="sm" className="hidden md:inline-flex">
              Tambah player <PlusIcon className="ml-2" />
            </Button>
            <Button
              onClick={() => setSheetOpened(true)}
              size="sm"
              className="md:hidden"
            >
              Tambah player <PlusIcon className="ml-2" />
            </Button>
          </>
        )}
      </div>
      {players.map((player) => {
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

      <Sheet open={sheetOpened} onOpenChange={setSheetOpened}>
        <SheetContent side="bottom">
          <SheetHeader className="text-left">
            <SheetTitle>Tambah player</SheetTitle>
          </SheetHeader>
          <div className="my-4">
            <div className="space-y-1">
              <Label htmlFor="mlbb-role">Pilih role</Label>
              <Select
                value={searchRole}
                onValueChange={(value) => setSearchRole(value as MlbbRole)}
              >
                <SelectTrigger id="mlbb-role">
                  <SelectValue placeholder="Cari role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MlbbRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {mlbbRoleEnumToText(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="my-2 w-full">
              Random player <ShuffleIcon className="ml-2" />
            </Button>

            {registeredPlayers
              ?.filter(
                (registeredPlayer) => registeredPlayer.role === searchRole,
              )
              .map((registeredPlayer) => {
                return (
                  <div
                    key={registeredPlayer.profileUserId}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <span className="text-sm">
                      {registeredPlayer.player.mlbbUsername}

                      <span className="ml-1 text-muted-foreground">
                        ({mlbbRoleEnumToText(registeredPlayer.role)})
                      </span>
                    </span>

                    <Button size="sm">Tambah ke tim</Button>
                  </div>
                );
              })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
