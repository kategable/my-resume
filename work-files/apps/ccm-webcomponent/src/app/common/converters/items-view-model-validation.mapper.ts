//contactsViewModel.isValid = contactViewModelValidationMapper(contactsViewModel)

import { validateDate } from '../../api/envelope/envelope-helper';
import { ItemGroup, ItemType } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel, ItemsViewModel } from '../../firm-request/models/envelope-view-model';

export const itemsViewModelValidationMapper = (itemsViewModel: ItemsViewModel): boolean => {
  return (
    !!itemsViewModel &&
    itemsViewModel.items.length > 0 &&
    itemsViewModel.items.every(
      (request: ItemDataViewModel) =>
        request.selectedAssignTo &&
        (request.item.noResponse ||
          (((request.item.itemType === ItemType.AS_OF_DATE && validateDate(request.item.asOfDate)) ||
            (request.item.itemType === ItemType.DATE_RANGE &&
              validateDate(request.item.startDate) &&
              validateDate(request.item.endDate))) &&
            validateDate(request.item.dueDate))) &&
        (request.item.itemGroup != ItemGroup.P_AND_S_BLOTTER ||
          (request.selectedClearingFirm?.crdId && request.selectedClearingFirm?.name))
    )
  );
};
