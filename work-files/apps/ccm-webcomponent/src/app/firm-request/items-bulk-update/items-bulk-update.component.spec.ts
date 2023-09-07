import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsBulkUpdateComponent } from './items-bulk-update.component';
import { ItemType } from '../../api/envelope/envelope.api.interface';
describe('ItemsBulkUpdateComponent', () => {
  let component: ItemsBulkUpdateComponent;

  beforeEach(async () => {
    component = new ItemsBulkUpdateComponent({} as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update model on update calledn with AS_OF_DATE', () => {
    const model = {
      item: { itemType: ItemType.AS_OF_DATE, asOfDate: 'asd', startDate: '', endDate: '', dueDate: '' },
    } as any;
    component.model = model;
    component.visited = { asOfDate: true, dueDate: true, endDate: true, startDate: true, user: true };
    component.update();
    expect(component.model.item.asOfDate).toEqual('');
  });
  it('should update model on update calledn with DATE_RANGE', () => {
    const model = {
      item: { itemType: ItemType.DATE_RANGE, asOfDate: 'asd', startDate: 'asd', endDate: 'asd', dueDate: 'asd' },
    } as any;
    component.model = model;
    component.visited = { asOfDate: true, dueDate: true, endDate: true, startDate: true, user: true };
    component.update();
    expect(component.model.item.asOfDate).toEqual('');
    expect(component.model.item.startDate).toEqual('');
    expect(component.model.item.endDate).toEqual('');
    expect(component.model.item.dueDate).toEqual('');
  });
});
