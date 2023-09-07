import { ExternalContact } from '../../firm-request/models/external-contacts.model';
import { Contacts } from '../../service/config/config.interface';

export const contactMapper = (externalContact: ExternalContact): Contacts => {
  const cnt: Contacts = {
    crdId: externalContact.id,
    businessEmail: externalContact.contactInfo.emails.map((e) => e.emailAddress),
    name: `${externalContact.person.firstName} ${externalContact.person.lastName}`,
    primaryFlag: false,
    category: '',
    roleContacts: externalContact.roleContacts.map((r) => ({ role: { name: r.role.name } })),
    contactType: [],
  };
  return cnt;
};
