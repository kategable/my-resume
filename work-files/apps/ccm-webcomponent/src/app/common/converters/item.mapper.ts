import { ItemData, ItemGroup, TagsDto } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel } from '../../firm-request/models/envelope-view-model';
import { Contacts, Staffs } from '../../service/config/config.interface';
import { yyyymmdd2UsDate } from '../../api/envelope/envelope-helper';
import { staffsMapper } from './staffs-InternalUserData.mapper';
import { statusIconsMap } from '../constants/status-icons';
import { itemIconMapper } from './item-icon.mapper';

export const itemMapper = (item: ItemData, envelopeId?: string): ItemDataViewModel => {
  let selectedClearingFirm = null;
  if (item.formData) {
    //TODO: parse to model and back other properties of formData as documented at:
    // https://wiki.finra.org/pages/viewpage.action?pageId=1066855697
    const parsedFirm = JSON.parse(item.formData).clearingFirm;
    // P&S blotter - formData has clearingFirm
    // Order blotter - formData is not empty, but no clearingForm
    // other items - no formData
    if (parsedFirm) {
      // skip clearingFirm for order blotter
      selectedClearingFirm = {
        ...new Contacts(),
        crdId: parsedFirm.id,
        name: parsedFirm.name,
      };
    }
  }

  let selectedAssignTo: Staffs | null = null;
  if (item.user) {
    selectedAssignTo = staffsMapper(item.user);
  }
  (statusIconsMap as any)[item.status || ''];
  if (!item.status) {
    item.status = 'Draft';
  }
  const itemViewModel: ItemDataViewModel = {
    version: item.version,
    item: { ...item },
    envelopeId: envelopeId || '',
    catFlag: false,
    d2iFlag: item.itemGroup === ItemGroup.ORDER_BLOTTER || item.itemGroup === ItemGroup.P_AND_S_BLOTTER,
    hasClearingFirm: item.itemGroup === ItemGroup.P_AND_S_BLOTTER,
    noResponseFlagAvailable: item.noResponse,
    open: false,
    rciFlag: item.securityLevels?.some((level: string) => level === 'RCI') || false,
    selectedAssignTo,
    selectedClearingFirm,
    hasBeenSaved: true,
    icon: itemIconMapper(item),
    selected: false,
  };

  itemViewModel.item.dueDate = yyyymmdd2UsDate(item.dueDate);
  itemViewModel.item.asOfDate = yyyymmdd2UsDate(item.asOfDate);
  (itemViewModel.item.startDate = yyyymmdd2UsDate(item.startDate)),
    (itemViewModel.item.endDate = yyyymmdd2UsDate(item.endDate));

  item.tags?.forEach((tag: TagsDto) => {
    if (tag.key === 'CAT') itemViewModel.catFlag = true;
  });
  return itemViewModel;
};
