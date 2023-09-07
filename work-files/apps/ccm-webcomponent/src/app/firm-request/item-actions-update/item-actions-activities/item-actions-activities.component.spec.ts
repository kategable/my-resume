import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemActionsActivitiesComponent } from './item-actions-activities.component';
import { UiStateService } from '../../../service/ui-state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ItemActionsActivitiesComponent', () => {
  let component: ItemActionsActivitiesComponent;
  let fixture: ComponentFixture<ItemActionsActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemActionsActivitiesComponent],
      providers: [{ provide: UiStateService, userValue: {} }],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemActionsActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
