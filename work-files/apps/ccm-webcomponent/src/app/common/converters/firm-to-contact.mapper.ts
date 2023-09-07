import { Firm } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export class FirmToContactsMappers {
  public static firmToContactMapper = (firm: Firm): Contacts => {
    const contact = new Contacts();
    contact.crdId = firm.id + '';
    contact.name = firm.name + '';
    return contact;
  };
  public static firmToContactSafeMapper = (firm: Firm): Contacts | null => {
    if (!firm) return null;
    const contact = new Contacts();
    contact.crdId = firm.id + '';
    contact.name = firm.name;
    return contact;
  };
}
