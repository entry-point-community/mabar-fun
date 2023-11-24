import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from 'class-validator';

import { createDateNowValidator } from '../validators/createDateNowValidator';
import { createMinMaxValidator } from '../validators/createMinMaxValidator';

export class UpdateEventDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(150)
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  maxPlayers?: number;

  @IsDateString()
  @Validate(createDateNowValidator(), {
    message: 'start registration date must be greater than current time',
  })
  @IsOptional()
  startRegistrationDate?: Date;

  @IsDateString()
  @Validate(
    createMinMaxValidator(
      'startRegistrationDate',
      'endRegistrationDate',
      'period start must be less than period end',
    ),
  )
  @IsOptional()
  endRegistrationDate?: Date;
}
