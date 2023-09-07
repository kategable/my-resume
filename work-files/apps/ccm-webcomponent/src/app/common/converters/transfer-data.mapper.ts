import { EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';
import { FirmAssignee, IndividualAssignee, PatchAssignees } from '../../firm-request/models/patch-request.model';
import { mapList } from './mappers';
import { Contacts } from '../../service/config/config.interface';
import { contactToNotificationMapper } from './contact-to-notification.mapper';
import { staffToNotificationMapper } from './staff-to-notification.mapper';

export const transferDataMapper = (viewModel: EnvelopeViewModel): PatchAssignees => {
  let patchData = { assignees: [], notifications: [] } as PatchAssignees;

  if (viewModel.contactsViewModel.selectedContactsForIndividual.length) {
    const notifications = mapList(contactToNotificationMapper)(
      viewModel.contactsViewModel.selectedContactsForIndividual
    );
    const selectedIndividuals = viewModel.contactsViewModel.selectedIndividuals;
    if (selectedIndividuals.length)
      viewModel.contactsViewModel.selectedIndividuals.forEach((ind: Contacts) => {
        const foundInExternal = notifications.find((pp) => pp.email === ind.businessEmail[0]);
        if (!foundInExternal) {
          const ll = contactToNotificationMapper(ind);
          notifications.push(ll);
        }
        patchData.assignees.push({ userId: null, email: ind.businessEmail[0] } as IndividualAssignee); //needs to be enhanced with firm
      });

    notifications.forEach((pp) => {
      pp.group = null;
    });
    patchData.notifications = notifications;
  } else if (viewModel.contactsViewModel.selectedFirm) {
    const crdId = viewModel.contactsViewModel.selectedFirm.crdId;
    patchData.assignees.push({ orgId: crdId } as FirmAssignee); //needs to be enhanced with firm

    const notifications = mapList(contactToNotificationMapper)(viewModel.contactsViewModel.selectedContactsForFirm);
    notifications.forEach((pp) => {
      pp.orgId = Number(crdId);
    });
    patchData.notifications = notifications;
  }

  if (viewModel.contactsViewModel.selectedStaffs.length) {
    const notifications = mapList(staffToNotificationMapper)(viewModel.contactsViewModel.selectedStaffs);
    notifications.forEach((pp) => {
      patchData.notifications.push(pp);
    });
  }
  return patchData;
};
