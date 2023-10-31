import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// HOW TO USE: Put this function inside the @Validate() decorator in property that expected to be max value
export function createMinMaxValidator(
  minProperty: string,
  maxProperty: string,
  errorMessage: string,
) {
  @ValidatorConstraint({ name: 'minMaxValidator', async: false })
  class MinMaxValidator implements ValidatorConstraintInterface {
    validate(value: any, args: any) {
      const { property, object } = args;

      if (property === maxProperty) {
        const min = object[minProperty];
        const max = value;
        return min !== max && min < max;
      }

      return true;
    }

    defaultMessage(args: ValidationArguments) {
      const { property } = args;

      if (property === maxProperty) {
        return errorMessage;
      }

      return '';
    }
  }

  return MinMaxValidator;
}
