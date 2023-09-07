import { Staffs } from '../../service/config/config.interface';
import { Notification } from '../../firm-request/models/patch-request.model';

export const staffToNotificationMapper = (staff: Staffs): Notification => {
  const user: Notification = {
    id: null,
    userId: staff.userId,
    firstName: null,
    lastName: null,
    email: staff.email,
    identityProvider: 'ISSO',
    orgId: 1,
    phone: null,
    phoneExt: null,
    orgClass: null,
    group: null,
  };
  return user;
};
