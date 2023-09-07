import { ItemActionsUpdateComponent } from './item-actions-update.component';
import { UiStateService } from '../../service/ui-state.service';
import { ITEM_ACTIONS } from '../../service/action-statuses-data';

describe('ItemActionsUpdateComponent', () => {
  let component: ItemActionsUpdateComponent;
  let mockuiService: jasmine.SpyObj<UiStateService>;

  beforeEach(async () => {
    mockuiService = jasmine.createSpyObj('UiStateService', ['updateItemAction ']);

    component = new ItemActionsUpdateComponent(mockuiService as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateItem', () => {
    component.selectedAction = ITEM_ACTIONS[0];
    const spy = spyOn(component, 'accept');
    component.update({} as any);
    expect(spy).toHaveBeenCalled();
  });
});
