import { useState } from 'react';
import { MlbbRole, Prisma } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { PlayersListItem } from './PlayerListItem';

interface PlayersListProps {
  registeredPlayers: Prisma.EventRegistrationGetPayload<{
    include: { player: true };
  }>[];
}

export const PlayersList: React.FC<PlayersListProps> = ({
  registeredPlayers,
}) => {
  const [searchName, setSearchName] = useState<string>('');
  const [searchRole, setSearchRole] = useState<MlbbRole | 'all'>('all');

  return (
    <div className="mt-3 flex flex-col gap-2">
      <h3 className="text-lg font-semibold">
        Players terdaftar ({registeredPlayers.length})
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <Input
          onChange={(e) => setSearchName(e.target.value)}
          className="mb-2"
          placeholder="Cari nickname player"
        />

        <Select
          value={searchRole}
          onValueChange={(value) => setSearchRole(value as MlbbRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Cari role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              All Roles
            </SelectItem>
            {Object.values(MlbbRole).map((role) => (
              <SelectItem key={role} value={role}>
                {mlbbRoleEnumToText(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {registeredPlayers
          .filter(
            (registeredPlayer) =>
              registeredPlayer.player.mlbbUsername?.includes(searchName) &&
              registeredPlayer.role.includes(
                searchRole === 'all' ? '' : searchRole,
              ),
          )
          .map((registeredPlayer) => {
            return (
              <PlayersListItem
                key={registeredPlayer.profileUserId}
                mlbbUsername={registeredPlayer.player.mlbbUsername as string}
                role={registeredPlayer.role}
                playerId={registeredPlayer.player.userId}
              />
            );
          })}
      </div>
    </div>
  );
};
