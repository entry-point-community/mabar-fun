import { EventTeamPlayer, MlbbRole } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

type PlayerSelectItemProps = {
  profileUserId: string;
  profilePictureUrl: string | null;
  displayName: string;
  mlbbUsername: string;
  mlbbUserId: string;
  mlbbServerId: string;
  role: MlbbRole;
  selected?: boolean;
  onSelect: (profileUserId: string) => void;
  teamsRegisteredIn: Omit<EventTeamPlayer, 'role'>[];
};

const RadioIndicator = ({ selected = false }: { selected: boolean }) => {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2">
      <div
        className={cn(
          'h-4 w-4 rounded-full',
          selected && 'bg-primary',
          !selected && 'group-hover:bg-muted',
        )}
      />
    </div>
  );
};

export const PlayerSelectItem: React.FC<PlayerSelectItemProps> = ({
  displayName,
  mlbbServerId,
  mlbbUserId,
  mlbbUsername,
  profilePictureUrl,
  role,
  profileUserId,
  onSelect,
  selected = false,
  teamsRegisteredIn,
}) => {
  return (
    <div
      onClick={() => onSelect(profileUserId)}
      className="group flex h-max items-center justify-between rounded-md border p-4 hover:cursor-pointer"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex w-16 flex-col">
            <Avatar className="h-16 w-16 rounded-md">
              <AvatarImage src={profilePictureUrl || ''} />
              <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-1 flex-col items-start">
            <p className="text-center text-sm text-muted-foreground">
              {displayName}
            </p>
            <p>{mlbbUsername}</p>
            <p>
              {mlbbUserId} ({mlbbServerId})
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{mlbbRoleEnumToText(role)}</Badge>
          {teamsRegisteredIn.map((team) => {
            return (
              <Badge variant="outline" key={team.eventTeamId}>
                Team {team.eventTeamId}
              </Badge>
            );
          })}
        </div>
      </div>
      <RadioIndicator selected={selected} />
    </div>
  );
};
