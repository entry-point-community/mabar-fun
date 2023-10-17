import { EventRegistration, MlbbRole } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

interface RegisterEventFormProps {
  playerRoles: Pick<EventRegistration, 'role'>[];
}

export const RegisterEventForm: React.FC<RegisterEventFormProps> = ({
  playerRoles = [],
}) => {
  const calculateRoleCount = (role: MlbbRole) => {
    return playerRoles.filter((player) => player.role === role).length;
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid grid-cols-2 gap-4 rounded-md border p-4 text-sm">
        <p className="col-span-full font-semibold text-muted-foreground">
          Player count
        </p>

        <p>Exp Laner: {calculateRoleCount(MlbbRole.EXP)}</p>
        <p>Jungler: {calculateRoleCount(MlbbRole.JUNGLE)}</p>
        <p>Mid Laner: {calculateRoleCount(MlbbRole.MID)}</p>
        <p>Roamer: {calculateRoleCount(MlbbRole.ROAM)}</p>
        <p>Gold Laner: {calculateRoleCount(MlbbRole.GOLD)}</p>
      </div>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pilih role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(MlbbRole).map((role) => (
            <SelectItem key={role} value={role}>
              {mlbbRoleEnumToText(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button>Daftarkan diri</Button>
    </div>
  );
};
