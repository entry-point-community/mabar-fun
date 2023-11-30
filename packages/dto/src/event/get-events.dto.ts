import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { Paginable } from '../pagination';

export class GetEventsDTO extends Paginable {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  readonly isOngoing?: boolean;
}
