import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description: string;

  @IsNumber()
  @Min(1)
  @Max(150)
  @Transform(({ value }) => parseInt(value))
  maxPlayers: number;

  @IsDate()
  @MinDate(new Date())
  startRegistrationDate: Date;

  @IsDate()
  endRegistrationDate: Date;
}
