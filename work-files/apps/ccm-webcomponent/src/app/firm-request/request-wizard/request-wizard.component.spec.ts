import { RequestWizardComponent } from './request-wizard.component';
import { UiStateService } from '../../service/ui-state.service';
import { FirmIndividualType } from '../enums/firm-rep-type';
import { ContactsComponent } from '../contacts/contacts.component';
import { ItemsInRequestComponent } from '../items-in-request/items-in-request.component';
import { ItemType } from '../../api/envelope/envelope.api.interface';

describe('RequestWizardComponent', () => {
  let component: RequestWizardComponent;
  let mockuiService: jasmine.SpyObj<UiStateService>;
  beforeEach(async () => {
    mockuiService = jasmine.createSpyObj('UiStateService', [
      'showRedAlert',
      'showGreenAlert',
      'saveDraft',
      'publishChanges',
    ]);
    component = new RequestWizardComponent(mockuiService as any);
    component.viewModel = { contactsViewModel: { recipientType: FirmIndividualType.FIRM } } as any;
    component.appContacts = { markInvalid: () => {} } as unknown as ContactsComponent;
    component.appItemsInRequest = { markInvalid: () => {} } as unknown as ItemsInRequestComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should saveDraft should give alert that no contact is selected', () => {
    component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
  });

  it('should emit event on delete draft', () => {
    spyOn(component.onDeleteDraft, 'emit');

    component.deleteDraft();

    expect(component.onDeleteDraft.emit).toHaveBeenCalled();
  });
  it('should throw error on save draft if no view model', async () => {
    component.viewModel = undefined;
    try {
      await component.saveDraft();
    } catch (error) {
      expect(error).toEqual(new Error('view model must be defined'));
    }
  });
  it('should show error when no selected contact provided on saveDraft', async () => {
    component.viewModel = {
      contactsViewModel: { recipientType: FirmIndividualType.INDIVIDUAL, selectedIndividuals: [] },
    } as any;
    await component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('need a contact', true);
  });
  it('should show error when no selected contact provided on saveDraft in firm', async () => {
    component.viewModel = { contactsViewModel: { recipientType: FirmIndividualType.FIRM, selectedFirm: null } } as any;
    await component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('need a firm', true);
  });
  it('should show error for adHoc item without a name on SaveDraft', async () => {
    component.viewModel = {
      contactsViewModel: { recipientType: FirmIndividualType.FIRM, selectedFirm: {} },
      itemsViewModel: { items: [{ item: { adhocItem: true, itemName: null } }] },
    } as any;
    await component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('need Ad Hoc item name', true);
  });
  it('should show error for adHoc item without a category on SaveDraft', async () => {
    component.viewModel = {
      contactsViewModel: { recipientType: FirmIndividualType.FIRM, selectedFirm: {} },
      itemsViewModel: { items: [{ item: { adhocItem: true, itemName: 'test', adhocItemCategory: null } }] },
    } as any;
    await component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('need Ad Hoc item category', true);
  });

  it('should show green alert on saveDraft succesfull', async () => {
    component.viewModel = {
      contactsViewModel: { recipientType: FirmIndividualType.FIRM, selectedFirm: {} },
      itemsViewModel: { items: [{ item: { adhocItem: true, itemName: 'test', adhocItemCategory: {} } }] },
    } as any;
    mockuiService.saveDraft.and.returnValue(Promise.resolve({ status: true, message: 'test' }));
    await component.saveDraft();
    expect(mockuiService.showGreenAlert).toHaveBeenCalled();
    expect(mockuiService.showGreenAlert).toHaveBeenCalledWith('test', true);
  });

  it('should show red alert on saveDraft unsuccesfull', async () => {
    component.viewModel = {
      contactsViewModel: { recipientType: FirmIndividualType.FIRM, selectedFirm: {} },
      itemsViewModel: { items: [{ item: { adhocItem: true, itemName: 'test', adhocItemCategory: {} } }] },
    } as any;
    mockuiService.saveDraft.and.returnValue(Promise.resolve({ status: false, message: 'test' }));
    await component.saveDraft();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('test', true);
  });

  it('should emit event on publish', async () => {
    component.viewModel = {
      isPublished: false,
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        selectedContactsForIndividual: [{}],
        selectedStaffs: [{}],
        emailSubjectEditable: 'test',
      },
      itemsViewModel: {
        items: [
          {
            selectedAssignTo: {},
            item: {
              itemType: ItemType.AS_OF_DATE,
              asOfDate: '02/02/2023',
              adhocItem: false,
              itemName: 'test',
              dueDate: '01/01/2023',
            },
          },
        ],
      },
    } as any;
    await component.publish();
    component.onPublish.subscribe((value) => {
      expect(1).toEqual(1);
    });
  });
  it('should return isReadyToPublish true', () => {
    component.viewModel = {
      isPublished: false,
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        selectedContactsForIndividual: [{}],
        selectedStaffs: [{}],
        emailSubjectEditable: 'test',
      },
      itemsViewModel: {
        items: [
          {
            selectedAssignTo: {},
            item: {
              itemType: ItemType.AS_OF_DATE,
              asOfDate: '02/02/2023',
              adhocItem: false,
              itemName: 'test',
              dueDate: '01/01/2023',
            },
          },
        ],
      },
    } as any;
    expect(component.isReadyToPublish(component.viewModel as any)).toBeTruthy();
  });

  it('should throw error on publish draft if no view model', async () => {
    component.viewModel = undefined;
    try {
      await component.publish();
    } catch (error) {
      expect(error).toEqual(new Error('view model must be defined'));
    }
  });
  it('should show green alert on publish succesfull on publishChanges', async () => {
    component.viewModel = {
      isPublished: false,
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        selectedContactsForIndividual: [{}],
        selectedStaffs: [{}],
        emailSubjectEditable: 'test',
      },
      itemsViewModel: {
        items: [
          {
            selectedAssignTo: {},
            item: {
              itemType: ItemType.AS_OF_DATE,
              asOfDate: '02/02/2023',
              adhocItem: false,
              itemName: 'test',
              dueDate: '01/01/2023',
            },
          },
        ],
      },
    } as any;
    mockuiService.publishChanges.and.returnValue(Promise.resolve({ good: true, message: 'test' }));
    await component.publishChanges();
    expect(mockuiService.showGreenAlert).toHaveBeenCalled();
    expect(mockuiService.showGreenAlert).toHaveBeenCalledWith('test', true);
  });

  it('should throw error on publishChanges if no view model', async () => {
    component.viewModel = undefined;
    try {
      await component.publishChanges();
    } catch (error) {
      expect(error).toEqual(new Error('view model must be defined'));
    }
  });
  it('should show red alert on publish unsuccesfull on publishChanges', async () => {
    component.viewModel = {
      isPublished: false,
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        selectedContactsForIndividual: [{}],
        selectedStaffs: [{}],
        emailSubjectEditable: 'test',
      },
      itemsViewModel: {
        items: [
          {
            selectedAssignTo: {},
            item: {
              itemType: ItemType.AS_OF_DATE,
              asOfDate: '02/02/2023',
              adhocItem: false,
              itemName: 'test',
              dueDate: '01/01/2023',
            },
          },
        ],
      },
    } as any;
    mockuiService.publishChanges.and.returnValue(Promise.resolve({ good: false, message: 'test' }));
    await component.publishChanges();
    expect(mockuiService.showRedAlert).toHaveBeenCalled();
    expect(mockuiService.showRedAlert).toHaveBeenCalledWith('test', true);
  });
});
