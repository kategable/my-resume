import { ItemActionType } from '../../api/envelope/enums/item-actions';
import { ItemEvent } from '../../firm-request/item-actions-update/item-actions-activities/item-activity.model';
import { PatchRequest } from '../../firm-request/models/patch-request.model';

export const eventsFromPatchMapper = (patch: PatchRequest, events: ItemEvent[] | undefined): ItemEvent[] => {
  let list = events || [];
  if (!patch.action.desc) {
    return list;
  }
  let item = {
    action: patch.action.desc,
    createDate: new Date().toISOString(),
    userName: ' You',
    user: { identityProvider: 'ISSO' },
    formattedComments: patch.note,
  } as any;
  if (patch.action.itemType === ItemActionType.WITH_DATE) {
    item.dueDate = patch.date;
  }
  list.push(item);
  return list;
};
