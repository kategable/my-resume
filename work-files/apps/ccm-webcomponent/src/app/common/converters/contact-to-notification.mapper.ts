import { Contacts } from '../../service/config/config.interface';
import { emailMapper } from './email.mapper';
import { Notification } from '../../firm-request/models/patch-request.model';

export const contactToNotificationMapper = (contact: Contacts): Notification => {
  const user: Notification = {
    id: null,
    userId: null,
    firstName: null,
    lastName: null,
    email: emailMapper(contact),
    identityProvider: 'EWS',
    orgId: -2,
    phone: null,
    phoneExt: null,
    orgClass: null,
    group: null,
  };
  return user;
};
