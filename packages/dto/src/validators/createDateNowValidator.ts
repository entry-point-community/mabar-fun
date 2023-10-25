import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getUnixTime } from 'date-fns';

// to validate if input time is lower than current time
export function createDateNowValidator() {
  @ValidatorConstraint({ name: 'dateNowValidator', async: false })
  class DateNowValidator implements ValidatorConstraintInterface {
    validate(value: any) {
      const currentDate = new Date();
      return getUnixTime(new Date(value)) > getUnixTime(currentDate);
    }

    defaultMessage() {
      return 'input time must be greater than the current time';
    }
  }

  return DateNowValidator;
}
