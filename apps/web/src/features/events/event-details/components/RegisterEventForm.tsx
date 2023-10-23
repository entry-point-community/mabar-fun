import { useState } from 'react';
import { EventRegistration, MlbbRole } from '@v6/db';
import { RegisterEventDTO } from '@v6/dto';

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
  onRegister: (params: RegisterEventDTO) => void;
}

export const RegisterEventForm: React.FC<RegisterEventFormProps> = ({
  playerRoles = [],
  onRegister,
}) => {
  const [selectedRole, setSelectedRole] = useState<MlbbRole | null>(null);

  const calculateRoleCount = (role: MlbbRole) => {
    return playerRoles.filter((player) => player.role === role).length;
  };

  const handleRegisterEvent = () => {
    if (selectedRole) {
      onRegister({
        mlbbRole: selectedRole,
      });
    }
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
      <Select onValueChange={(value) => setSelectedRole(value as MlbbRole)}>
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

      <Button disabled={!selectedRole} onClick={handleRegisterEvent}>
        Daftarkan diri
      </Button>
    </div>
  );
};
