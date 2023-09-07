//contactsViewModel.isValid = contactViewModelValidationMapper(contactsViewModel)

import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';
import { EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';

export const contactViewModelValidationMapper = (viewModel: EnvelopeViewModel): boolean => {
  if (viewModel.isPublished) {
    if (viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM) {
      return (
        viewModel.contactsViewModel.selectedContactsForFirm?.length > 0 &&
        viewModel.contactsViewModel.selectedStaffs?.length > 0
      );
    } else {
      return (
        viewModel.contactsViewModel.selectedContactsForIndividual?.length > 0 &&
        viewModel.contactsViewModel.selectedStaffs?.length > 0
      );
    }
  } else {
    //DRAFT
    if (viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM) {
      let valid = viewModel.contactsViewModel.selectedFirm ? true : false;
      valid = valid && viewModel.contactsViewModel.emailSubjectEditable?.length > 0;
      if (viewModel.contactsViewModel.includeContactInfo) {
        valid = valid && viewModel.contactsViewModel.email?.length > 0 ? true : false;
      }
      //valid = valid && contactsViewModel.phone
      return (
        valid &&
        viewModel.contactsViewModel.selectedContactsForFirm?.length > 0 &&
        viewModel.contactsViewModel.selectedStaffs?.length > 0
      );
    } else {
      return (
        viewModel.contactsViewModel.selectedContactsForIndividual?.length > 0 &&
        viewModel.contactsViewModel.selectedStaffs?.length > 0
      );
    }
  }
  return false;
};
