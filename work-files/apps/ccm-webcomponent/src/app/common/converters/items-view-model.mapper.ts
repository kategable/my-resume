import { usDate2yyyymmdd } from '../../api/envelope/envelope-helper';
import { AttachmentData, ItemData, ItemType } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel, ItemsViewModel } from '../../firm-request/models/envelope-view-model';
import { staffsToUserMapper } from './staffs-to-user.mapper';

export const itemsViewModelMapper = (model: ItemsViewModel): ItemData[] => {
  const lstItemData: ItemData[] = model.items.map((model: ItemDataViewModel) => {
    const attachments = model.item.attachments.map((attachment: AttachmentData) => {
      const att = {
        ...attachment,
      };
      delete att.total;
      delete att.loaded;
      return att;
    });
    const newItem: ItemData = {
      ...model.item,
      attachments,
    };
    newItem.user = staffsToUserMapper(model.selectedAssignTo);
    //this is for adhoc item to clear fields that are not needed for API
    if (newItem.adhocItem && newItem.noResponse) {
      newItem.dueDate = null;
      newItem.itemType = ItemType.NON_DATE;
      delete newItem.startDate;
      delete newItem.endDate;
      delete newItem.asOfDate;
      delete newItem.templateData;
    } else {
      newItem.dueDate = usDate2yyyymmdd(model.item.dueDate);
      newItem.startDate = usDate2yyyymmdd(model.item.startDate);
      newItem.endDate = usDate2yyyymmdd(model.item.endDate);
      newItem.asOfDate = usDate2yyyymmdd(model.item.asOfDate);
      newItem.templateData = model.item.templateData;
    }
    if (model.selectedClearingFirm) {
      newItem.formData = JSON.stringify({
        clearingFirm: {
          id: model.selectedClearingFirm.crdId,
          name: model.selectedClearingFirm.name,
        },
      });
    }

    delete newItem.status;
    delete newItem.attributes;
    delete newItem.securityLevels;
    delete newItem.events;
    delete newItem.partiallySubmitted;
    delete newItem.ewsCommentCount;

    return newItem;
  });
  return lstItemData;
};
