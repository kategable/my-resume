import { ExternalUserData } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export const extrenalUserDataMapper = (user: ExternalUserData): Contacts => {
  const contact = {
    crdId: user.id,
    name: user.name,
    category: '',
    contactType: [],
    primaryFlag: false,
    businessEmail: [user.email],
    roleContacts: [{ role: { name: user.role } } as any],
  } as Contacts;
  return contact;
};
