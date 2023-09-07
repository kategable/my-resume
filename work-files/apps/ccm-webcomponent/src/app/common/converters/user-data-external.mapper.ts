import { ExternalUserData } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';
import { REGULATORY_INQUIRIES } from '../constants/envelope.constants';
import { emailMapper } from './email.mapper';

export const userDataExternalMapper = (contact: Contacts): ExternalUserData => {
  const user: ExternalUserData = {
    name: contact.name,
    email: emailMapper(contact),
    required: true,
    group: REGULATORY_INQUIRIES,
  };
  return user;
};
