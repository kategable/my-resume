import { InternalUserData } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export const internalUserDataMapper = (user: InternalUserData): Contacts => {
  return {
    crdId: user.id,
    name: user.name,
    category: '',
    contactType: [],
    primaryFlag: false,
    businessEmail: [user.email],
    roleContacts: [{ role: { name: user.role } } as any],
  } as Contacts;
};
