import { ItemData, ItemGroup, ItemTemplateGroup, ItemType } from '../../api/envelope/envelope.api.interface';
import { itemMapper } from './item.mapper';
import { ItemDataViewModel } from '../../firm-request/models/envelope-view-model';
import { ItemTemplateApi } from '../../api/envelope/template.api.interface';

const itemGroupMap = new Map<ItemTemplateGroup, ItemGroup>();
itemGroupMap.set(ItemTemplateGroup.DOCUMENT, ItemGroup.DOCUMENT);
itemGroupMap.set(ItemTemplateGroup.FORM, ItemGroup.FORM);
itemGroupMap.set(ItemTemplateGroup.QUESTION, ItemGroup.QUESTION);
itemGroupMap.set(ItemTemplateGroup.P_AND_S_BLOTTER, ItemGroup.P_AND_S_BLOTTER);
itemGroupMap.set(ItemTemplateGroup.ORDER_BLOTTER, ItemGroup.ORDER_BLOTTER);

function itemGroupTemplate2Item(itemTemplateGroup: ItemTemplateGroup): ItemGroup {
  const ret = itemGroupMap.get(itemTemplateGroup);
  if (!ret) throw new Error(`Unknown ItemTemplateGroup: ${itemTemplateGroup}`);
  return ret;
}

export const templateMapper = (template: ItemTemplateApi): ItemDataViewModel => {
  let itemType: ItemType = ItemType.DATE_RANGE;

  if (template.datesSetup.code == 'as-of-date') {
    itemType = ItemType.AS_OF_DATE;
  } else if (template.datesSetup.code == 'date-range') {
    itemType = ItemType.DATE_RANGE;
  } else {
    itemType = ItemType.NON_DATE;
  }

  let templateData;

  if (!template.adhocItem) {
    templateData = {
      id: template.id,
      category: template.category?.name,
      noResponseAvailable: template.attributes.noResponseFlagAvailable,
    };
  }

  const itemData: ItemData = {
    securityLevels: [],
    noResponse: false,
    itemName: template.name,
    itemType,
    itemGroup: itemGroupTemplate2Item(template.type),
    attachments: [],
    adhocItem: template.adhocItem,
    version: null,
    notes: template.note?.text || '',
    startDate: '',
    endDate: '',
    dueDate: '',
    templateData,
    status: 'Draft',
    ewsCommentCount: 0,
  };
  if (template.adhocItem) {
    itemData.itemName = null;
  }
  let itemDataViewModel = itemMapper(itemData);
  itemDataViewModel.hasBeenSaved = false;
  return itemDataViewModel;
};
