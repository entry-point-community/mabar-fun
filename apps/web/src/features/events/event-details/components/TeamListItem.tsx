import { useState } from 'react';
import { PlusIcon, ShuffleIcon } from '@radix-ui/react-icons';
import { useGetPlayersFromEventQuery } from '@v6/api';
import { MlbbRole, Prisma } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ScrollArea } from '~/components/ui/scroll-area';
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
  SheetFooter,
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
        <SheetContent
          side="bottom"
          className="flex h-[95vh] flex-col justify-between"
        >
          <SheetHeader className="mb-2 text-left">
            <SheetTitle>Tambah player</SheetTitle>
            <div className="grid grid-cols-2 gap-2">
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
              <Input placeholder="Search nickname" />
            </div>
            <Button variant="secondary" className="mt-2 w-full">
              Random player <ShuffleIcon className="ml-2" />
            </Button>
          </SheetHeader>
          <ScrollArea className="h-full pb-2">
            <div className="flex flex-col gap-2">
              {registeredPlayers
                ?.filter(
                  (registeredPlayer) => registeredPlayer.role === searchRole,
                )
                .map(({ player, role, profileUserId }) => {
                  const {
                    displayName,
                    profilePictureUrl,
                    mlbbUsername,
                    mlbbUserId,
                    mlbbServerId,
                  } = player;

                  return (
                    <div
                      key={profileUserId}
                      className="group flex items-center justify-between gap-4 rounded-md border p-4"
                    >
                      <div className="flex w-16 flex-col flex-wrap justify-center gap-1.5">
                        <Avatar className="h-16 w-16 rounded-md">
                          <AvatarImage src={profilePictureUrl || ''} />
                          <AvatarFallback>
                            {displayName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-center text-sm text-muted-foreground">
                          {displayName}
                        </p>
                      </div>
                      <div className="flex flex-1 flex-col items-start">
                        <p>{mlbbUsername}</p>
                        <p className="text-sm">
                          {mlbbUserId} ({mlbbServerId})
                        </p>
                        <Badge className="mt-1.5" variant="secondary">
                          {mlbbRoleEnumToText(role)}
                        </Badge>
                      </div>
                      <div className="h-5 w-5 rounded-full border group-hover:bg-muted"></div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
          <SheetFooter className="flex flex-col gap-4 border-t-2 pt-2">
            <SheetTitle>Player terpilih:</SheetTitle>
            {/* TODO: use actual data */}
            <div className="flex items-start gap-4">
              <div className="flex w-16 flex-col flex-wrap justify-center gap-1.5">
                <Avatar className="h-16 w-16 rounded-md">
                  <AvatarImage src="http://localhost:54321/storage/v1/object/public/profile-pictures/1697129641854-d749c822-58a1-4101-a0ba-db8dc6823933.jpeg" />
                  <AvatarFallback>VF</AvatarFallback>
                </Avatar>
                <p className="text-center text-sm text-muted-foreground">
                  Full
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p>Nickname</p>
                <p>12343212 (2211)</p>
                <Badge className="mt-1.5" variant="secondary">
                  {mlbbRoleEnumToText(MlbbRole.JUNGLE)}
                </Badge>
              </div>
            </div>
            <Button>Pilih player</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
