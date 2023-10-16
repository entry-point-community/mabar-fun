import { MlbbRole } from '@v6/db';

import { mlbbRoleEnumToText } from '~/utils/role';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

export const RegisterEventForm = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="grid grid-cols-2 gap-4 rounded-md border p-4 text-sm">
        <p className="col-span-full font-semibold text-muted-foreground">
          Player count
        </p>

        <p>Exp Laner: 3</p>
        <p>Jungler: 3</p>
        <p>Mid Laner: 3</p>
        <p>Roamer: 3</p>
        <p>Gold Laner: 3</p>
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
