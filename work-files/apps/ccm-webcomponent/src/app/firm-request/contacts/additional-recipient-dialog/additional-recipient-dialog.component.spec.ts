import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdditionalRecipientDialogComponent } from './additional-recipient-dialog.component';

describe('AdditionalRecipientDialogComponent', () => {
  let component: AdditionalRecipientDialogComponent;
  let fomr;
  beforeEach(async () => {
    component = new AdditionalRecipientDialogComponent(new FormBuilder());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should make form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.contactForm).toBeTruthy();
  });
  it('should emit onClose when close is called', () => {
    spyOn(component.onClose, 'emit');
    component.close();
    expect(component.onClose.emit).toHaveBeenCalled();
  });
  it('should emit onAddContact when addContact is called', () => {
    spyOn(component.onAddContact, 'emit');
    component.addContact();
    expect(component.onAddContact.emit).toHaveBeenCalled();
  });
  it('should not emit onAddContact when addContact is called and form is invalid', () => {
    spyOn(component.onAddContact, 'emit');
    component.contactForm.setErrors({ invalid: true });
    component.addContact();
    expect(component.onAddContact.emit).not.toHaveBeenCalled();
  });
  it('should set control value on onChange', () => {
    component.ngOnInit();
    component.onChange({ target: { value: 'test' } } as any, component.FirstControl);
    expect(component.FirstControl.value).toEqual('test');
  });
  it('should return true from isChanged when form is dirty', () => {
    component.ngOnInit();
    component.contactForm.markAsDirty();
    expect(component.isChanged()).toBeTrue();
  });
  it('should return true from isChanged when form is touched', () => {
    component.ngOnInit();
    component.contactForm.markAsTouched();
    expect(component.isChanged()).toBeTrue();
  });
  it('should return false from isChanged when form is not touched or dirty', () => {
    component.ngOnInit();
    expect(component.isChanged()).toBeFalse();
  });
});
