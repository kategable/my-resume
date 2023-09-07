import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

export class CustomValidators {
  static LessThanToday(control: AbstractControl<any, any>): ValidationErrors | null {
    if (lessThanToday(control.value)) return { lessThanToday: true };
    return null;
  }
}

export function lessThanToday(date: string | null) {
  if (!date) return false;
  const today = new Date();
  return new Date(date) < today;
}
