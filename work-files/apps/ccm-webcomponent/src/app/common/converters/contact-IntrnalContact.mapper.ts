import { InternalContact } from '../../firm-request/service/firm-request.service';
import { Contacts } from '../../service/config/config.interface';

export const addContactMapper = (user: InternalContact): Contacts => {
  const contact: Contacts = {
    crdId: user.fields.ac_source_id,
    name: user.fields.ac_finra_users_fullname,
    category: '',
    contactType: [],
    primaryFlag: false,
    businessEmail: [user.fields.ac_finra_users_email_address],
    roleContacts: [],
  };

  return contact;
};
