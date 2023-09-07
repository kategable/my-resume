import { ItemEvent } from '../../firm-request/item-actions-update/item-actions-activities/item-activity.model';
import { DocumentModel, ItemEventViewModel } from '../../firm-request/models/envelope-view-model';

export const eventsMapper = (events: ItemEvent[] | undefined): ItemEventViewModel[] => {
  if (!events) return [];
  let list = events.map((ev) => {
    const viewModel = {} as ItemEventViewModel;
    viewModel.identityProvider = ev.user.identityProvider;
    viewModel.dueDate = ev.dueDate;
    viewModel.fullName = `${ev.user?.firstName} ${ev.user?.lastName}`;
    viewModel.isExternalUser = ev.action.indexOf('Submitted') !== -1;
    viewModel.userName = ev.userName;
    viewModel.targetId = ev.user.orgId;
    viewModel.action = ev.action;
    viewModel.formattedComments = ev.formattedComments;
    viewModel.documents = ev.documents.map((d) => {
      const file = { attachmentUrl: d.attachmentUrl, filename: d.filename, fileSize: d.fileSize } as DocumentModel;
      return file;
    });

    viewModel.createDate = ev.createDate;

    return viewModel;
  });
  return list;
};
