import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { FirmRequestService, InternalContact } from '../../service/firm-request.service';

import { AdditionalContactDialogComponent } from './additional-contact-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { COMPONENT_DEBOUNCE_TIME_MILLIS } from '../../../common/constants/envelope.constants';

describe('AdditionalContactDialogComponent', () => {
  let component: AdditionalContactDialogComponent;
  let firmRequestServiceMock: any;

  beforeEach(async () => {
    firmRequestServiceMock = jasmine.createSpyObj('FirmRequestService', ['fetchInternalContacts']);
    component = new AdditionalContactDialogComponent(firmRequestServiceMock as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on  search', () => {
    spyOn(component.searchSubject, 'next');
    component.search({ detail: { value: 'test' } } as any);
    expect(component.searchSubject.next).toHaveBeenCalled();
  });

  it('should clear search on ngOninit', () => {
    component.selectedIntContacts = [{ email: '' } as any];
    component.ngOnInit();
    expect(component.selectedIntContacts).toEqual([]);
  });

  it('should add new value to selected list on handleResultClick', () => {
    component.selectedIntContacts = [{ email: 'test123' } as any];
    component.handleResultClick({ email: 'test' } as any);
    expect(component.selectedIntContacts).toEqual([{ email: 'test123' }, { email: 'test' } as any]);
  });

  it('should exit on handleResultClick if exists', () => {
    component.selectedIntContacts = [{ email: '1' } as any];
    component.handleResultClick({ email: '1' } as any);
    expect(component.selectedIntContacts).toEqual([{ email: '1' } as any]);
  });
  it('should start search onFocus', () => {
    component.internalContactsInFocus = false;
    spyOn(component, 'search');
    component.onFocus({} as any);
    expect(component.search).toHaveBeenCalled();
    expect(component.internalContactsInFocus).toBeTrue();
  });
  it('should emit onAddContacts when addSelectedContacts is called', () => {
    spyOn(component.onAddContacts, 'emit');
    component.addSelectedContacts();
    expect(component.onAddContacts.emit).toHaveBeenCalled();
  });
  it('shoudl remove contact on onRemoveSelectedIntContact', () => {
    component.selectedIntContacts = [{ email: '1' } as any];
    component.onRemoveSelectedIntContact({ email: '1' } as any);
    expect(component.selectedIntContacts).toEqual([]);
  });
  it('should emit onClose on onCloseDialog', () => {
    spyOn(component.onClose, 'emit');
    component.onCloseDialog();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
  it('should set internalContactsInFocus to false on onInternalContactBlur', fakeAsync(() => {
    component.internalContactsInFocus = true;
    component.onInternalContactBlur();
    tick(1000);
    expect(component.internalContactsInFocus).toBeFalse();
  }));
  it('should return on search when key 13', () => {
    spyOn(component, 'search');
    component.search({ detail: { event: { keyCode: 13 } } } as any);
    expect(component.search).toHaveBeenCalled();
  });
});
