import { MlbbRole } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';

type PlayersListItemProps = {
  mlbbUsername: string;
  role: MlbbRole;
};

export const PlayersListItem: React.FC<PlayersListItemProps> = ({
  mlbbUsername,
  role,
}) => {
  return (
    <div className="col-span-full flex justify-between rounded-md bg-secondary px-3 py-1.5 text-sm md:col-span-1">
      <p>{mlbbUsername}</p>
      <p className="text-muted-foreground">{mlbbRoleEnumToText(role)}</p>
    </div>
  );
};
