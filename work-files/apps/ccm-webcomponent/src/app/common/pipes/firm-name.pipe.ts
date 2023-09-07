import { Pipe, PipeTransform } from '@angular/core';
import { Contacts } from '../../service/config/config.interface';

@Pipe({
  name: 'firmName',
})
export class FirmNamePipe implements PipeTransform {
  transform(firm: Contacts | null | undefined, ...args: unknown[]): unknown {
    let value = firm?.name;
    if (!value) {
      value = firm?.businessEmail && firm?.businessEmail.length ? firm?.businessEmail[0] : '';
    }
    return value;
  }
}
