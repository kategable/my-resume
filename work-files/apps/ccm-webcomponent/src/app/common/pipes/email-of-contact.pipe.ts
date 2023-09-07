import { Pipe, PipeTransform } from '@angular/core';
import { Contacts } from '../../service/config/config.interface';

@Pipe({
  name: 'emailOfContact',
})
export class EmailOfContactPipe implements PipeTransform {
  transform(contact: Contacts, ...args: unknown[]): unknown {
    return contact.businessEmail && contact.businessEmail.length ? contact.businessEmail[0] : '';
  }
}
