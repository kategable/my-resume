import { InternalContact } from '../../firm-request/service/firm-request.service';
import { Staffs } from '../../service/config/config.interface';

export const staffInternalContactMapper = (user: InternalContact): Staffs => {
  const staffs = {
    userId: user.fields.ac_source_id + '',
    fullName: user.fields.ac_finra_users_fullname,
    role: '',
    primaryFlag: false,
    email: user.fields.ac_finra_users_email_address,
  } as Staffs;
  return staffs;
};
