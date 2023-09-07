import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewitemComponent } from './view-item.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ViewitemComponent', () => {
  let component: ViewitemComponent;
  let fixture: ComponentFixture<ViewitemComponent>;
  let debugElement: DebugElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewitemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewitemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have component if no item provided', () => {
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-view-item"]'));
    expect(view).toBeFalsy();
  });
  it('should have component if item provided', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-view-item"]')).nativeElement;
    expect(view).toBeTruthy();
  });
  it('should have item.name', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-name"]')).nativeElement;
    expect(view.textContent?.trim()).toEqual('test');
  });
  it('should not have item.d21', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-view-d2iFlag"]'));
    expect(view).toBeFalsy();
  });
  it('should have item.d21', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } }, d2iFlag: true } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-d2iFlag"]')).nativeElement;
    expect(view.textContent).toEqual('D2i');
  });
  it('should not have item.user.name', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-view-item-user-name"]'));
    expect(view).toBeFalsy();
  });
  it('should have item.user-name', () => {
    component.model = {
      selectedAssignTo: { fullName: 'user-name' },
      item: { id: 1, name: 'test', datesSetup: { code: '13' } },
    } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-user-name"]')).nativeElement;
    expect(view.textContent).toEqual('Assign To: user-name');
  });
  it('should not have item.dueDate', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-view-dueDate"]'));
    expect(view).toBeFalsy();
  });
  it('should have item.status', () => {
    component.model = {
      icon: 'test-icon',
      item: { id: 1, itemName: 'test', status: 'test-status', datesSetup: { code: '13' } },
    } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-status"]')).nativeElement;
    expect(view.textContent).toEqual('test-status');
  });

  it('should call select item', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } } } as any;
    fixture.detectChanges();
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-view-item"]'));
    const spy = spyOn(component.onItemSelect, 'emit');
    view.triggerEventHandler('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should have item.cat', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } }, catFlag: true } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-catFlag"]')).nativeElement;
    expect(view.textContent).toEqual('CAT');
  });
  it('should have item.rci', () => {
    component.model = { item: { id: 1, itemName: 'test', datesSetup: { code: '13' } }, rciFlag: true } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-rciFlag"]')).nativeElement;
    expect(view.textContent).toEqual('RCI');
  });
  it('should have item.partiallySubmitted', () => {
    component.model = {
      item: { id: 1, itemName: 'test', datesSetup: { code: '13' } },
      partiallySubmitted: true,
    } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-partiallySubmitted"]')).nativeElement;
    expect(view.textContent).toEqual('Partial Submission');
  });
  it('should have firm comments', () => {
    component.model = {
      item: { id: 1, itemName: 'test', datesSetup: { code: '13' }, ewsCommentCount: 12 },
      partiallySubmitted: true,
    } as any;
    fixture.detectChanges();
    const view: HTMLElement = debugElement.query(By.css('[data-test="ccm-item-comments"]')).nativeElement;
    expect(view.textContent).toEqual('Firm Comments: 12');
  });
});
