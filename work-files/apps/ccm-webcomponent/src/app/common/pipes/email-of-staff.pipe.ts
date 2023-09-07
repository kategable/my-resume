import { Pipe, PipeTransform } from '@angular/core';
import { Contacts, Staffs } from '../../service/config/config.interface';

@Pipe({
  name: 'emailOfStaff',
})
export class EmailOfStaffPipe implements PipeTransform {
  transform(staffs: Staffs, ...args: unknown[]): unknown {
    return staffs.email ? staffs.email : '';
  }
}
