import { ItemsViewModel } from '../../firm-request/models/envelope-view-model';
import { itemsViewModelValidationMapper } from './items-view-model-validation.mapper';
import { ItemType } from '../../api/envelope/envelope.api.interface';

describe('itemsViewModelValidationMapper', () => {
  it('should return true when itemsViewModel is null', () => {
    const source = {
      items: [
        {
          selectedAssignTo: {},
          item: { itemType: ItemType.AS_OF_DATE, asOfDate: '06/30/2023', dueDate: '06/30/2023' },
        } as any,
      ],
    } as ItemsViewModel;
    const result = itemsViewModelValidationMapper(source);
    expect(result).toBeTruthy();
  });
});
