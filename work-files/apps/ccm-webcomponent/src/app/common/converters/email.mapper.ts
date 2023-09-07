import { Contacts } from '../../service/config/config.interface';

export const emailMapper = (contact: Contacts): string => {
  return contact.businessEmail && contact.businessEmail.length > 0 ? contact.businessEmail[0] : '';
};
