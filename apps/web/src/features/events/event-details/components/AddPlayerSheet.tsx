import { useState } from 'react';
import { ShuffleIcon } from '@radix-ui/react-icons';
import { RegisteredPlayer } from '@v6/api';
import { MlbbRole } from '@v6/db';

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
import { PlayerSelectItem } from './PlayerSelectItem';

type AddPlayerSheetProps = {
  sheetOpened: boolean;
  setSheetOpened: (state: boolean) => void;
  registeredPlayers: RegisteredPlayer[];
};

export const AddPlayerSheet: React.FC<AddPlayerSheetProps> = ({
  setSheetOpened,
  sheetOpened,
  registeredPlayers,
}) => {
  const [searchRole, setSearchRole] = useState<MlbbRole>(MlbbRole.EXP);
  const [selectedPlayerProfileId, setSelectedPlayerProfileId] =
    useState<string>('');

  return (
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
                  <PlayerSelectItem
                    key={profileUserId}
                    role={role}
                    displayName={displayName as string}
                    profilePictureUrl={profilePictureUrl}
                    mlbbServerId={mlbbServerId as string}
                    mlbbUserId={mlbbUserId as string}
                    mlbbUsername={mlbbUsername as string}
                    profileUserId={profileUserId}
                    selected={profileUserId === selectedPlayerProfileId}
                    onSelect={(profileId) =>
                      setSelectedPlayerProfileId(profileId)
                    }
                  />
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
              <p className="text-center text-sm text-muted-foreground">Full</p>
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
  );
};
