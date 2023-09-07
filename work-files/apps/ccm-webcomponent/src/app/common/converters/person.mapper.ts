import { PersonDto } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export const personMapper = (person: PersonDto): Contacts => {
  const contact = new Contacts();
  contact.crdId = person.userId;
  contact.name = !person.fullName ? '' : person.fullName;
  contact.businessEmail = [person.email];
  return contact;
};
