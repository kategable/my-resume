import { PersonDto } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';
import { FIRM_ID_EXTERNAL, PUBLIC } from '../constants/envelope.constants';
import { emailMapper } from './email.mapper';

export const selectedIndividualsMapper = (contact: Contacts): PersonDto => {
  const person = {
    userId: contact.crdId,
    email: emailMapper(contact),
    firmId: FIRM_ID_EXTERNAL,
    orgClass: PUBLIC,
  } as PersonDto;

  return person;
};
