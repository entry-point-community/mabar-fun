import { MlbbRole } from '@v6/db';

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
}) => {
  return (
    <div
      onClick={() => onSelect(profileUserId)}
      className="group flex items-center justify-between gap-4 rounded-md border p-4 hover:cursor-pointer"
    >
      <div className="flex w-16 flex-col flex-wrap justify-center gap-1.5">
        <Avatar className="h-16 w-16 rounded-md">
          <AvatarImage src={profilePictureUrl || ''} />
          <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
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
      <RadioIndicator selected={selected} />
    </div>
  );
};
