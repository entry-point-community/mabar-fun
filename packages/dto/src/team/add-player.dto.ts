import { MlbbRole } from '@v6/db';
import { IsEnum, IsUUID } from 'class-validator';

export class AddPlayerToTeamDTO {
  @IsEnum(MlbbRole)
  mlbbRole: MlbbRole;

  @IsUUID(4)
  playerId: string;
}
