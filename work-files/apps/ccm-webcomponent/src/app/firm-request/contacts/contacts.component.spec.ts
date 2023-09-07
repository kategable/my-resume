import { of } from 'rxjs';
import { ContactsComponent } from './contacts.component';
import { UiStateService } from '../../service/ui-state.service';
import { FormBuilder } from '@angular/forms';
describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let mockuiService: jasmine.SpyObj<UiStateService>;
  beforeEach(async () => {
    mockuiService = jasmine.createSpyObj('UiStateService', ['fetchInternalContacts']);
    mockuiService.envelopeViewModel$ = of({} as any);
    component = new ContactsComponent(mockuiService as any, new FormBuilder());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if searchFn is called', async () => {
    mockuiService.fetchInternalContacts.and.returnValue(new Promise((resolve) => resolve([])));
    await component.searchFn('test');

    expect(component.searchResults).toEqual([]);
  });

  it('should return undefined if onRecipientTypeChange is called and values are the same', async () => {
    const eventObj: any = {
      target: {
        value: 'test',
      },
    };
    const viewModelMock = {
      contactsViewModel: {
        recipientType: 'test',
      },
    } as any;
    const result = component.onRecipientTypeChange(eventObj, viewModelMock);
    expect(result).toEqual(undefined);
  });
  it('GIVEN a user has initiated a transfer, WHEN they confirm the transfer, THEN they are able to update "Recipient Selection", "Recipient (To)" and "Recipient (CC)" fields per the normal recipient flow', () => {
    const viewModelMock = {
      contactsViewModel: {
        recipientType: 'test',
      },
    } as any;
    component.transfer(viewModelMock);
    expect(viewModelMock.transferInProgress).toBeTrue();
    expect(component.showTransferConfirmation).toBeFalse();
    component.confirmTransfer();
    expect(component.showTransferConfirmation).toBeTrue();
  });
  //   it('should load ext and internal contacts on firm select', () => {
  //     const eventObj: any = {
  //       bubbles: true,
  //       cancelable: false, target: {
  //         value: 'test'
  //       }
  //     };
  //     let fileSelectEvent: any = new Event("change", eventObj);
  //     const inputEle = fixture.debugElement.query(By.css('#firm')).nativeElement
  //     inputEle.dispatchEvent(fileSelectEvent);

  //     fixture.detectChanges();
  //     fixture.whenStable().then(() => {
  //       expect(component.externalContacts?.length).toBeDefined();
  //       expect(component.internalContacts?.length).toBeDefined();
  //     })
  //   });

  //   it('should get schema and set firms and internal contacts', () => {
  //     component.setInternalContacts();
  //     component.setRequestAssignees();

  //     expect(component.firms).toBeDefined();
  //     expect(component.firms.length).toBe(1);

  //     expect(component.internalContacts).toBeDefined();
  //     expect(component.internalContacts.length).toBe(WEB_COMPONENT_SCHEMA.staffs.length);
  //   });

  //   it('should return filtered firms', () => {
  //     component.recipientType = 'FIRM';
  //     component.firms = WEB_COMPONENT_SCHEMA.contacts;
  //     let filteredFirms = component.getRequestAssignees('FIRM');

  //     expect(filteredFirms).toBeDefined();
  //     expect(filteredFirms.length).toBe(1);

  //     component.recipientType = 'INDIVIDUAL'
  //     filteredFirms = component.getRequestAssignees('INDIVIDUAL');

  //     expect(filteredFirms).toBeDefined();
  //     expect(filteredFirms.length).toBe(1);
  //   });

  //   it('should get external contacts on onFirmSelect', () => {
  //     spyOn(component, 'getExternalContacts');

  //     component.onFirmSelect({
  //       detail: {
  //         text: 'A & M SECURITIES, LLC'
  //       }
  //     });
  //     //this because firm is the same :todo: add more firms for this test to the test data
  //     expect(component.getExternalContacts).not.toHaveBeenCalled();
  //   });

  //   //todo: same as above ks
  //   xit('should add single primary contact', fakeAsync(() => {

  //     firmRequestMockService.fetchContactsOfFirm.and.returnValue(SINGLE_PRIMARY_CONTACT);

  //     component.onFirmSelect({
  //       detail: {
  //         text: 'A & M SECURITIES, LLC',
  //         value: '39345'
  //       }
  //     });
  //     tick();
  //     fixture.detectChanges();

  //     expect(component.primaryContact).toBeDefined();
  //     expect(component.primaryContact?.person?.firstName).toEqual('HUGH');
  //   }));

  //   //todo: this code has to accomidate the no changes fix
  //   //use form.touched instead of checking values
  //   //onFirmSelect Also does too much
  //   xit('should not add primary contacts', fakeAsync(() => {

  //     firmRequestMockService.fetchContactsOfFirm.and.returnValue(NO_PRIMARY_CONTACT);

  //     component.onFirmSelect({
  //       detail: {
  //         text: 'A & M SECURITIES, LLC',
  //         value: '39345'
  //       }
  //     });

  //     tick();
  //     fixture.detectChanges();
  //     expect(component.primaryContact).toBeFalsy()
  //   }));

  //   //todo: ks: this code has to accomidate the no changes fix
  //   xit('should add only single primary contact when multiple primary contacts returned', fakeAsync(() => {

  //     firmRequestMockService.fetchContactsOfFirm.and.returnValue(MULTIPLE_PRIMARY_CONTACTS);

  //     component.onFirmSelect({
  //       detail: {
  //         text: 'A & M SECURITIES, LLC',
  //         value: '39345'
  //       }
  //     });

  //     tick();
  //     fixture.detectChanges();

  //     expect(component.primaryContact).toBeDefined();
  //     expect(component.primaryContact.person.firstName).toEqual('HUGH');

  //   }));

  //   it('should insert internal contact', () => {

  //     const newContact = [{
  //       "name": 'First Last',
  //       "group": "Regulatory Inquiries",
  //       "email": "test@fira.org",
  //       "required": true,
  //     }];

  //     component.insertInternalContact(newContact);

  //     expect(component.draftPayload.dataRequestContacts.firmDataInternal.lstUserGroupDataSelected[0].lstUserData[0].name).toEqual(newContact[0].name);
  //     expect(component.draftPayload.dataRequestContacts.firmDataInternal.lstUserGroupDataSelected[0].lstUserData[0].email).toEqual(newContact[0].email);
  //   });

  //   it('should get schema and return firms contacts', () => {
  //     component.setInternalContacts();
  //     component.setRequestAssignees();

  //     expect(component.getRequestAssignees('FIRM').length).toBe(1);
  //   });

  //   it('should get schema and return firms and internal contacts with email', () => {
  //     component.setInternalContacts();
  //     component.setRequestAssignees();

  //     expect(component.getRequestAssignees('INDIVIDUAL').length).toBe(1);
  //   });

  //   //TODO: could not fix this test
  //   it('should get external contacts on selectRequestAssignee', () => {
  //     component.selectRequestAssignee({
  //       detail: {
  //         text: 'A JANSSEN LONGENECKER',
  //         value: '2612186'
  //       }
  //     });
  //     expect(component.externalContacts.length).toBe(1);
  //   });

  //   it('should get external contacts on selectRequestAssignee', () => {
  //     component.addIndividualRequestAssignees('2612186');
  //     expect(component.requestAssignee.id).toBe('2612186');
  //   });

  //   it('should findIndividualAssignees', () => {
  //     component.addIndividualRequestAssignees('2612186');
  //     const assignee = component.findIndividualAssignees('2612186');
  //     expect(assignee).toBeTruthy();
  //   });

  //   it('should removeIndividualAssignees', () => {
  //     component.addIndividualRequestAssignees('2612186');
  //     component.removeIndividualAssignees(0);
  //     expect(component.requestAssignee).toBeTruthy();
  //   });
});
