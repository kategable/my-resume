import { PersonDto } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export const selectedIndividualsMapper = (contact: Contacts): PersonDto => {
  const person = {
    userId: contact.crdId,
    name: contact.name,
    email: contact.businessEmail[0],
  } as PersonDto;

  return person;
};
