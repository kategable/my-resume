import { Pipe, PipeTransform } from '@angular/core';
import { Staffs } from '../../service/config/config.interface';

@Pipe({
  name: 'staffformat',
})
export class StaffFormatPipe implements PipeTransform {
  transform(contact: Staffs | null, ...args: unknown[]): string {
    if (!contact) {
      return '';
    }
    let value = contact.fullName;
    if (contact.role?.length) {
      value = `${value} (${contact.role})`;
    }
    return value;
  }
}
