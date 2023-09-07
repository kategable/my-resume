import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RequestTypeComponent } from './request-type.component';
import { UiStateService } from '../../service/ui-state.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemTemplateApi } from '../../api/envelope/template.api.interface';
import { ItemTemplateGroup } from '../../api/envelope/envelope.api.interface';

describe('RequestTypeComponent', () => {
  let component: RequestTypeComponent;
  let fixture: ComponentFixture<RequestTypeComponent>;
  let uiStateService: UiStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestTypeComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    uiStateService = TestBed.inject(UiStateService);
    fixture = TestBed.createComponent(RequestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render request template types', () => {
    const dataList = fixture.debugElement.query(By.css('#searchInput'));
    expect(dataList).toBeNull();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.query(By.css('#search-input')).nativeElement;
      expect(input.value).toBe('');
    });
  });
  it('should return true for blotter on isD2i', () => {
    const itemTemplateApi: ItemTemplateApi = { type: ItemTemplateGroup.P_AND_S_BLOTTER } as any;
    expect(component.isD2i(itemTemplateApi)).toBeTruthy();
  });
});
