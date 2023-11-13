import { MlbbRole } from '@v6/db';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class EditProfileDTO {
  @IsString()
  @IsOptional()
  @Length(4, 16)
  readonly mlbbUserId?: string;

  @IsString()
  @IsOptional()
  @Length(2, 7)
  readonly mlbbServerId?: string;

  @IsString()
  @IsOptional()
  @IsEnum(MlbbRole)
  readonly mlbbRole?: MlbbRole;

  @IsString()
  @IsOptional()
  @Length(3, 20)
  readonly displayName?: string;
}
