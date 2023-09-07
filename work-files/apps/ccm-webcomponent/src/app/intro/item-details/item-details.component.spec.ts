import { ItemDetailsCellRenderer } from './item-details.component';

describe('ItemDetailsCellRenderer', () => {
  let component: ItemDetailsCellRenderer;
  let agInitSpy: jasmine.Spy;
  let refreshSpy: jasmine.Spy;
  let formatDateSpy: jasmine.Spy;

  beforeEach(async () => {
    component = new ItemDetailsCellRenderer();
  });

  beforeEach(() => {
    agInitSpy = spyOn(component, 'agInit').and.callThrough();
    refreshSpy = spyOn(component, 'refresh').and.callThrough();
    formatDateSpy = spyOn(component, 'formatItemDate').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call agInit', () => {
    const params = {
      data: {
        rm_items: [],
      },
    };
    component.agInit(params);
    expect(agInitSpy).toHaveBeenCalled();
    expect(component.items).toEqual(null);
    expect(component.showNoItemsMessage).toBeTrue();
  });

  it('should call refresh', () => {
    const params = {
      data: {
        rm_items: [],
      },
    };
    component.refresh(params);
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should call formatDate', () => {
    const item = '2021-01-01';
    component.formatItemDate(item);
    expect(formatDateSpy).toHaveBeenCalled();
  });
});
