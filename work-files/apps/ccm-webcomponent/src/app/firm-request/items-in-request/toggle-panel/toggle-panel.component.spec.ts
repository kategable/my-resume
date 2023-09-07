import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePanelComponent } from './toggle-panel.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TogglePanelComponent', () => {
  let component: TogglePanelComponent;

  beforeEach(async () => {
    component = new TogglePanelComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit on  toggleItemTypeSelect', () => {
    spyOn(component.onShowPanelChange, 'emit');
    component.toggleItemTypeSelect();
    expect(component.onShowPanelChange.emit).toHaveBeenCalled();
  });
});
