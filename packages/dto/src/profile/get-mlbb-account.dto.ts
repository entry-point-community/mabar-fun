import { IsString, Length } from 'class-validator';

export class GetMlbbAccountDTO {
  @IsString()
  @Length(4, 16)
  readonly mlbbUserId: string;

  @IsString()
  @Length(2, 7)
  readonly mlbbServerId: string;
}
