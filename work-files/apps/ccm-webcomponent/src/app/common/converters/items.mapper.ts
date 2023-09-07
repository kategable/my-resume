import { ItemData } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel } from '../../firm-request/models/envelope-view-model';
import { Staffs } from '../../service/config/config.interface';
import { itemIconMapper } from './item-icon.mapper';
import { itemMapper } from './item.mapper';

export const itemsMapper = (staffs: Staffs[], items: ItemData[], envelopeId?: string): ItemDataViewModel[] => {
  return items.map((item: ItemData) => {
    const itemViewModel = itemMapper(item, envelopeId);
    itemViewModel.selectedAssignTo = staffs.find((s) => s.userId === item.user?.id) || null;
    itemViewModel.icon = itemIconMapper(item);
    itemViewModel.partiallySubmitted = item.partiallySubmitted;
    return itemViewModel;
  });
};
