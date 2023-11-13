import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getUnixTime, startOfDay } from 'date-fns';

// to validate if input time is lower than current time
export function createDateNowValidator() {
  @ValidatorConstraint({ name: 'dateNowValidator', async: false })
  class DateNowValidator implements ValidatorConstraintInterface {
    validate(value: any) {
      return getUnixTime(new Date(value)) > getUnixTime(startOfDay(new Date()));
    }

    defaultMessage() {
      return 'input time must be greater than the current time';
    }
  }

  return DateNowValidator;
}
