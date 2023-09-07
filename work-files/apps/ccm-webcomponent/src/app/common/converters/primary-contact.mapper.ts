import EnvelopeStatus from '../../firm-request/enums/envelope-status';
import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';
import { EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';
import { Contacts } from '../../service/config/config.interface';

export const primaryContactForFirmMapper = (viewModel: EnvelopeViewModel, contacts: Contacts[]): Contacts[] => {
  let list = [...viewModel.contactsViewModel.selectedContactsForFirm];
  if (
    contacts &&
    viewModel.status === EnvelopeStatus.DRAFT &&
    viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM
  ) {
    let primaryContact = contacts.find((firm: Contacts) => firm.primaryFlag) || null;

    if (primaryContact === null) {
      return list;
    }
    const foundExternalContact = list.find((contact: Contacts) => contact.crdId === primaryContact?.crdId);

    if (primaryContact && !list.length && !foundExternalContact) {
      list.push(primaryContact);
    }
  }
  return list;
};
