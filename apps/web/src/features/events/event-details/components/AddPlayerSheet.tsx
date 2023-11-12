import { useState } from 'react';
import { ShuffleIcon } from '@radix-ui/react-icons';
import {
  AddPlayerToTeamErrors,
  RegisteredPlayer,
  useAddPlayerToTeamMutation,
} from '@v6/api';
import { MlbbRole } from '@v6/db';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

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
import { queryClient } from '~/lib/react-query';
import { PlayerSelectItem } from './PlayerSelectItem';

type SelectedPlayer = {
  profilePictureUrl: string | null;
  displayName: string | null;
  mlbbUsername: string | null;
  mlbbUserId: string | null;
  mlbbServerId: string | null;
  role: MlbbRole;
  profileUserId: string;
};

type AddPlayerSheetProps = {
  sheetOpened: boolean;
  setSheetOpened: (state: boolean) => void;
  registeredPlayers: RegisteredPlayer[];
  teamId: number;
  eventId: number;
};

export const AddPlayerSheet: React.FC<AddPlayerSheetProps> = ({
  setSheetOpened,
  sheetOpened,
  registeredPlayers,
  teamId,
  eventId,
}) => {
  const [searchUsername, setSearchUsername] = useState<string>('');
  const [searchRole, setSearchRole] = useState<MlbbRole>(MlbbRole.EXP);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(
    null,
  );

  const { mutate, isPending } = useAddPlayerToTeamMutation({
    onSuccess: async () => {
      toast.success('Player berhasil ditambahkan', { position: 'top-center' });
      setSelectedPlayer(null);
      await queryClient.invalidateQueries(['event-teams', eventId]);
    },
    onError: (error) => {
      if (error.isAxiosError) {
        const err = error as AxiosError<{ errors: string[] }>;

        if (
          err?.response?.data.errors.includes(
            AddPlayerToTeamErrors.ALREADY_REGISTERED,
          )
        ) {
          toast.error('Player sudah terdaftar dalam tim', {
            position: 'top-center',
          });
          return;
        }
      }
    },
  });

  const handleAddPlayer = () => {
    if (selectedPlayer) {
      const { profileUserId, role } = selectedPlayer;

      mutate({
        mlbbRole: role,
        playerId: profileUserId,
        teamId,
      });
    }
  };

  return (
    <Sheet open={sheetOpened} onOpenChange={setSheetOpened}>
      <SheetContent side="bottom" className="h-[95vh]">
        <div className="mx-auto flex h-full max-w-screen-md flex-col justify-between">
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
              <Input
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Search nickname"
              />
            </div>
            <Button variant="secondary" className="mt-2 w-full">
              Random player <ShuffleIcon className="ml-2" />
            </Button>
          </SheetHeader>
          <ScrollArea className="h-full pb-2">
            <div className="flex flex-col gap-2">
              {registeredPlayers
                ?.filter(
                  (registeredPlayer) =>
                    registeredPlayer.role === searchRole &&
                    registeredPlayer.player.mlbbUsername?.includes(
                      searchUsername,
                    ),
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
                    <PlayerSelectItem
                      key={profileUserId}
                      role={role}
                      displayName={displayName as string}
                      profilePictureUrl={profilePictureUrl}
                      mlbbServerId={mlbbServerId as string}
                      mlbbUserId={mlbbUserId as string}
                      mlbbUsername={mlbbUsername as string}
                      profileUserId={profileUserId}
                      selected={profileUserId === selectedPlayer?.profileUserId}
                      onSelect={() =>
                        setSelectedPlayer({ ...player, role, profileUserId })
                      }
                    />
                  );
                })}
            </div>
          </ScrollArea>
          <SheetFooter className="flex flex-col gap-4 border-t-2 pt-2">
            <SheetTitle>Player terpilih:</SheetTitle>
            {selectedPlayer ? (
              <div className="flex items-start gap-4">
                <div className="flex w-16 flex-col flex-wrap justify-center gap-1.5">
                  <Avatar className="h-16 w-16 rounded-md">
                    <AvatarImage src={selectedPlayer.profilePictureUrl || ''} />
                    <AvatarFallback>
                      {selectedPlayer.displayName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-center text-sm text-muted-foreground">
                    {selectedPlayer.displayName}
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <p>{selectedPlayer.mlbbUsername}</p>
                  <p>
                    {selectedPlayer.mlbbUserId} ({selectedPlayer.mlbbServerId})
                  </p>
                  <Badge className="mt-1.5" variant="secondary">
                    {mlbbRoleEnumToText(selectedPlayer.role)}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-xl font-semibold leading-none">-</p>
            )}
            <Button
              onClick={handleAddPlayer}
              disabled={!selectedPlayer || isPending}
            >
              Pilih player
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
