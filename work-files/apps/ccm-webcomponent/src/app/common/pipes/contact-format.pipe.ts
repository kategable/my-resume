import { Pipe, PipeTransform } from '@angular/core';
import { Contacts } from '../../service/config/config.interface';
import { emailMapper } from '../converters/email.mapper';

@Pipe({
  name: 'contactformat',
})
export class ContactFormatPipe implements PipeTransform {
  transform(contact: Contacts, withEmail: boolean = true): string {
    let value = contact.name;
    if (value) {
      value = withEmail ? `${value} <${emailMapper(contact)}>` : value;
    } else {
      value = emailMapper(contact);
    }
    return value;
  }
}
