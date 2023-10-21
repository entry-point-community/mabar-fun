import { MlbbRole } from '@v6/db';
import { IsEnum, IsString } from 'class-validator';

export class RegisterEventDTO {
  @IsString()
  @IsEnum(MlbbRole)
  mlbbRole: MlbbRole;
}
