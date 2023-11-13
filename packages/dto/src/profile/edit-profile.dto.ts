import { MlbbRole } from '@v6/db';
import { IsEnum, IsString, Length } from 'class-validator';

export class EditProfileDTO {
  @IsString()
  @Length(4, 16)
  readonly mlbbUserId: string;

  @IsString()
  @Length(2, 7)
  readonly mlbbServerId: string;

  @IsString()
  @IsEnum(MlbbRole)
  readonly mlbbRole: MlbbRole;

  @IsString()
  @Length(3, 20)
  readonly displayName: string;
}
