import { TestBed } from '@angular/core/testing';
import { ComposerView } from '../firm-request/enums/composer-view';
import { UiStateService } from './ui-state.service';
import { FirmRequestService } from '../firm-request/service/firm-request.service';
import { EnvelopeService } from '../api/envelope/envelope.api.service';
import { PatchRequest, PatchSecurityLevels } from '../firm-request/models/patch-request.model';
import { ItemActionType } from '../api/envelope/enums/item-actions';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { BehaviorSubject, Observable, from, lastValueFrom, of } from 'rxjs';
import { ItemAction, ItemActionRequest } from '../firm-request/models/item-action-request.model';
import { RequestTemplate } from '../api/envelope/envelope.api.interface';
import { ConfigFacade } from './config/config.facade';
import { formatDateWithTime } from '../api/envelope/envelope-helper';
import { ConfigurationApiService } from '../api/configuration/configuration.api.service';
import { UiLoadingIndicatorService } from './ui-loading-indicator.service';
import { Actor, ApiSentryService } from './api.sentry.service';
import { LoadingModel } from '../firm-request/models/loading.model';
import { EnvelopeViewModel } from '../firm-request/models/envelope-view-model';
import { LogService } from './log.service';
import { FirmIndividualType } from '../firm-request/enums/firm-rep-type';

describe('UiStateService', () => {
  let service: UiStateService;
  let mockEnvelopeService: SpyObj<EnvelopeService>;
  let mockConfig: SpyObj<ConfigurationApiService>;
  let mockFirmRequestService: SpyObj<FirmRequestService>;
  let mockApiSentryService: SpyObj<ApiSentryService>;
  let mockConfigFacade: SpyObj<ConfigFacade>;
  let mockUiLoadingIndicatorService: SpyObj<UiLoadingIndicatorService>;
  class MockApiSentryService {
    getOrRegisterActor$: Observable<Actor> = from([{ username: 'testtest' } as Actor]);
  }
  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockEnvelopeService = createSpyObj('EnvelopeService', [
      'patch',
      'updateAction',
      'save',
      'delete',
      'publish',
      'find',
    ]);
    mockConfig = createSpyObj('ConfigurationApiService', ['getConfiguration']);
    mockConfig.getConfiguration.and.returnValue(of({} as any));
    mockApiSentryService = createSpyObj('MockApiSentryService', ['getOrRegisterActor']);
    mockApiSentryService.getOrRegisterActor.and.returnValue(from([{ username: 'testtest' } as Actor]));
    mockConfig.getConfiguration.and.returnValue(of({} as any));
    mockConfigFacade = createSpyObj('ConfigFacade', ['']);
    mockConfigFacade.config$ = of({ businessContext: { isFirmRequest: true }, contacts: [], staffs: [] } as any);

    mockFirmRequestService = createSpyObj('FirmRequestService', [
      'fetchRequestManagerTemplatesAll',
      'fetchRequestManagerTemplatesForCaseId',
      'getRequestTemplate',
      'selectedTemplateIdSubject',
      'fetchInternalContacts',
    ]);
    mockFirmRequestService.getRequestTemplate.and.returnValue(of({ id: 123 } as unknown as RequestTemplate));
    mockUiLoadingIndicatorService = createSpyObj('UiLoadingIndicatorService', ['show', 'hide']);
    service = new UiStateService(
      mockFirmRequestService as FirmRequestService,
      mockEnvelopeService as EnvelopeService,
      mockConfigFacade as ConfigFacade,
      mockApiSentryService,
      mockConfig as ConfigurationApiService,
      mockUiLoadingIndicatorService as UiLoadingIndicatorService,
      new LogService()
    );
    service['selectedTemplateId$'] = of('123');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  //TODO: fix test
  xit('should change view to create with true', () => {
    const template = {} as any;
    const loadingOnSpy = spyOn<any>(service, 'loadingOn');

    service.createEnvelope(template);

    service.loading$.subscribe((loadingModel: LoadingModel) => {
      expect(loadingOnSpy).toHaveBeenCalled();
    });

    service['selectedTemplate$'].subscribe((selectedTemplate: RequestTemplate | null) => {
      expect(selectedTemplate).toBe(template);
    });

    service.currentView$.subscribe((view: ComposerView | undefined) => {
      expect(view).toBe(ComposerView.CREATE_ENVELOPE);
    });
  });

  it('should change view to intro', () => {
    service.currentView$.subscribe((view: ComposerView | undefined) => {
      expect(view).toBe(ComposerView.INTRO);
    });

    service.start();
  });

  it('should change create envelope view to false when selectEnvelope called', (done) => {
    service.editEnvelopeObject({
      envelopeId: 'test123',
      draftPayload: {
        templateId: 'test',
        requestAssignees: { lstFirmData: [{ id: 123, name: 'firm' }] },
      },
    } as any);
    service.currentView$.subscribe((view: any) => {
      expect(view).toEqual(ComposerView.CREATE_ENVELOPE);
      done();
    });
  });

  it('should set actions correctly for Submitted Item', () => {
    service.selectItem({ item: { entityId: 123, envelopeId: '456', status: 'Submitted', tags: [] } } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(6);
      expect(actions[0].name).toEqual('Accept');
      expect(actions[1].name).toEqual('Add CAT flag');
      expect(actions[2].name).toEqual('Add RCI flag');
      expect(actions[3].name).toEqual('Partial Reject');
      expect(actions[4].name).toEqual('Reject');
      expect(actions[5].name).toEqual('Withdraw');
    });
  });

  it('should set actions correctly for Open Item', () => {
    service.selectItem({ item: { entityId: 123, envelopeId: '456', status: 'Open', tags: [] } } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(5);
      expect(actions[0].name).toEqual('Accept Offline Submission');
      expect(actions[1].name).toEqual('Add CAT flag');
      expect(actions[2].name).toEqual('Add RCI flag');
      expect(actions[3].name).toEqual('Change Due Date');
      expect(actions[4].name).toEqual('Withdraw');
    });
  });

  it('should set actions correctly for Overdue Item', () => {
    service.selectItem({ item: { entityId: 123, envelopeId: '456', status: 'Overdue', tags: [] } } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(7);
      expect(actions[0].name).toEqual('Accept Offline Submission');
      expect(actions[1].name).toEqual('Add CAT flag');
      expect(actions[2].name).toEqual('Add RCI flag');
      expect(actions[3].name).toEqual('Change Due Date');
      expect(actions[4].name).toEqual('Partial Reject');
      expect(actions[5].name).toEqual('Reject');
      expect(actions[6].name).toEqual('Withdraw');
    });
  });

  it('should set actions correctly for Re-opened Item', () => {
    service.selectItem({ item: { entityId: 123, envelopeId: '456', status: 'Re-opened', tags: [] } } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(5);
      expect(actions[0].name).toEqual('Accept Offline Submission');
      expect(actions[1].name).toEqual('Add CAT flag');
      expect(actions[2].name).toEqual('Add RCI flag');
      expect(actions[3].name).toEqual('Change Due Date');
      expect(actions[4].name).toEqual('Withdraw');
    });
  });

  it('should set actions correctly for No response Item', () => {
    service.selectItem({ item: { entityId: 123, envelopeId: '456', status: 'No Response', tags: [] } } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual('Add CAT flag');
      expect(actions[1].name).toEqual('Add RCI flag');
    });
  });

  it('should set actions correctly when item has CAT', () => {
    service.selectItem({
      item: { entityId: 123, envelopeId: '456', status: 'No Response', tags: [{ key: 'CAT', value: '' } as any] },
    } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual('Add RCI flag');
      expect(actions[1].name).toEqual('Remove CAT flag');
    });
  });
  it('should set actions correctly when item has RCI', () => {
    service.selectItem({
      item: { entityId: 123, envelopeId: '456', status: 'No Response', securityLevels: ['RCI'], tags: [] },
    } as any);
    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual('Add CAT flag');
      expect(actions[1].name).toEqual('Remove RCI flag');
    });
  });

  it('should set actions correctly when item has RCI and CAT', () => {
    service.selectItem({
      item: {
        entityId: 123,
        envelopeId: '456',
        status: 'No Response',
        securityLevels: ['RCI'],
        tags: [{ key: 'CAT', value: '' } as any],
      },
    } as any);

    service.itemActions$.subscribe((actions) => {
      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual('Remove CAT flag');
      expect(actions[1].name).toEqual('Remove RCI flag');
    });
  });

  describe('patch', () => {
    beforeEach(() => {
      mockEnvelopeService.patch.and.returnValue(of({} as any));
      mockEnvelopeService.updateAction.and.returnValue(of({} as any));
    });

    it('should create correct payload for envelope api patch for date update', async () => {
      //arrange
      const patch = {
        itemModel: { item: { entityId: 123, envelopeId: '456' } } as any,
        viewModel: {
          contactsViewModel: { envelopeId: '456' },
          itemsViewModel: {
            items: [{ item: { entityId: 123, envelopeId: '456' } }],
          },
        } as any,
        action: { itemType: ItemActionType.WITH_DATE, updateName: 'changeDueDate' } as any,
        note: 'test',
        date: '1/1/2023',
      } as PatchRequest;
      const request = [
        { itemId: 123, comments: 'test', dueDate: formatDateWithTime('01/01/2023 00:00:00') },
      ] as ItemActionRequest[];
      const envelope = { envelopeId: 'test123', draftPayload: { lstItemData: [patch.itemModel] } } as any;
      service.editEnvelopeObject(envelope);
      mockEnvelopeService.updateAction.and.returnValue(of(envelope));

      //act
      const result = await lastValueFrom(service.updateItemAction(patch));
      //assert
      expect(mockEnvelopeService.updateAction).toHaveBeenCalledOnceWith('456', request, ItemAction.changeDueDate);
      expect(result?.item.dueDate).toEqual('1/1/2023');
    });

    it('should create correct payload for envelope api patch for status patch', async () => {
      //arrange
      const patch = {
        itemModel: { item: { entityId: 123, envelopeId: '456' } } as any,
        viewModel: {
          contactsViewModel: { envelopeId: '456' },
          itemsViewModel: {
            items: [{ item: { entityId: 123, envelopeId: '456' } }],
          },
        } as any,
        action: { status: 'Accepted', itemType: ItemActionType.WITH_STATUS } as any,
        note: 'test',
        date: '',
      } as PatchRequest;
      const envelope = { envelopeId: 'test123', draftPayload: { lstItemData: [patch.itemModel] } } as any;
      service.editEnvelopeObject(envelope);
      mockEnvelopeService.patch.and.returnValue(of(envelope));
      const request = { updateReason: 'test', status: 'Accepted' };

      //act
      const result = await lastValueFrom(service.updateItemAction(patch));

      //assert
      expect(mockEnvelopeService.patch).toHaveBeenCalledOnceWith('456', 'ITEM', 123, request);
      expect(result?.item.status).toEqual('Accepted');
    });

    it('should update with correct payload for envelope api put for AOS action', async () => {
      //arrange
      const patch = {
        itemModel: { item: { entityId: 123, envelopeId: '456' } } as any,
        viewModel: {
          contactsViewModel: { envelopeId: '456' },
          itemsViewModel: {
            items: [{ item: { entityId: 123, envelopeId: '456' }, partiallySubmitted: true }],
          },
        } as any,
        action: { status: 'Accepted', itemType: ItemActionType.WITH_UPDATE, updateName: 'aos' } as any,
        note: 'test',
        date: '',
      } as PatchRequest;
      service.editEnvelopeObject({ envelopeId: 'test123', draftPayload: { lstItemData: [patch.itemModel] } } as any);
      const request = { itemId: patch.itemModel.item.entityId, comments: patch.note } as ItemActionRequest;

      //act
      const result = await lastValueFrom(service.updateItemAction(patch));

      //assert
      expect(mockEnvelopeService.updateAction).toHaveBeenCalledOnceWith('456', [request], ItemAction.aos);
      expect(result?.item.status).toEqual('Accepted');
      expect(result?.partiallySubmitted).toBeFalse();
    });

    it('should update with correct payload for envelope api for RCI action', async () => {
      //arrange
      const patch = {
        itemModel: { item: { entityId: 123, envelopeId: '456' } } as any,
        viewModel: {
          contactsViewModel: { envelopeId: '456' },
          itemsViewModel: {
            items: [{ item: { entityId: 123, envelopeId: '456' } }],
          },
        } as any,
        action: { tag: 'RCI', itemType: ItemActionType.WITH_SECURITY } as any,
        note: 'test',
        date: '',
      } as PatchRequest;
      const envelope = { envelopeId: 'test123', draftPayload: { lstItemData: [patch.itemModel] } } as any;
      service.editEnvelopeObject(envelope);
      const securityLevels = patch.action.tag === 'RCI' ? ['RCI'] : ['NONE'];
      const request = { updateReason: patch.note, securityLevels: securityLevels } as PatchSecurityLevels;
      mockEnvelopeService.patch.and.returnValue(of(envelope));

      //act
      const result = await lastValueFrom(service.updateItemAction(patch));

      //assert
      expect(mockEnvelopeService.patch).toHaveBeenCalledOnceWith('456', 'ITEM', 123, request);
      expect(result?.item.securityLevels).toEqual(securityLevels);
    });

    it('should update partialy submitted', async () => {
      //arrange
      const envelopeId = 'envelopeId-123';
      const internalId = 123;
      const patch = {
        itemModel: { item: { entityId: internalId, envelopeId: envelopeId } } as any,
        viewModel: {
          contactsViewModel: { envelopeId: envelopeId },
          itemsViewModel: {
            items: [{ item: { entityId: internalId, envelopeId: envelopeId }, partiallySubmitted: true }],
          },
        } as any,
        action: {
          desc: 'Withdrew',
          name: 'Withdraw',
          itemType: ItemActionType.WITH_STATUS,
          status: 'Withdrawn',
          statuses: ['Open', 'Overdue', 'Submitted', 'Re-opened'],
          modalOK: 'Withdraw',
          modalTitle: 'Confirm Withdrawal',
          confirmModal: true,
          modalMessage: 'Are you sure you want to withdraw this item?',
          updateName: ItemAction.withdraw,
        },
        note: 'test',
        date: '',
      } as PatchRequest;

      const envelope = { envelopeId, draftPayload: { lstItemData: [patch.itemModel] } } as any;
      service.editEnvelopeObject(envelope);

      const request = { itemId: patch.itemModel.item.entityId, comments: patch.note } as ItemActionRequest;
      mockEnvelopeService.patch.and.returnValue(of(envelope));

      //act
      const result = await lastValueFrom(service.updateItemAction(patch));

      //assert
      expect(result?.partiallySubmitted).toBeFalse();
    });
  });

  it('should getItemTags', () => {
    //arrange
    const patch = {
      action: { tag: 'RCA', value: '' },
      itemModel: {
        item: { entityId: 123, envelopeId: '456', tags: [{ key: 'CAT', value: '' }] },
      },
    } as any;
    //act
    const result = service.getItemTags(patch);
    //assert
    expect(result).toEqual([
      { key: 'CAT', value: '' },
      { key: 'RCA', value: '' },
    ] as any);
  });
  it('should show message for showRedAlert', () => {
    //arrange
    const message = 'test';
    //act
    service.showRedAlert(message);
    //assert
    service.alert$.subscribe((alert) => {
      expect(alert?.show).toBeTruthy();
      expect(alert?.message).toEqual(message);
    });
  });
  //
  it('should show message for showGreenAlert', () => {
    //arrange
    const message = 'test';
    //act
    service.showGreenAlert(message);
    //assert
    service.alert$.subscribe((alert) => {
      expect(alert?.show).toBeTruthy();
      expect(alert?.message).toEqual(message);
    });
  });
  it('should selectFirm', () => {
    //arrange
    const firm = { crdId: '1234' } as any;
    //act
    service.selectFirm(firm);
    //assert
    service.selectedFirm$.subscribe((firm) => {
      expect(firm).toEqual(firm);
    });
  });
  it('should associateFirm', () => {
    //arrange
    const firm = { firmId: '123' } as any;
    //act
    service.associateFirm(firm);
    //assert
    service.selectedFirm$.subscribe((firm) => {
      expect(firm).toEqual(firm);
    });
  });
  describe('saveDraft', () => {
    it('should return false if no view on saveDraft', async () => {
      //arrange
      //act
      const result = await service.saveDraft(null);
      //assert
      expect(result.status).toBeFalsy();
      expect(result.message).toEqual('no envelope to save');
    });

    it('should start  on saveDraft', async () => {
      //arrange
      //service.config$ = of({ businessContext: { isFirmRequest: true }, contacts: [], staffs: [] } as any);
      //act
      const result = await service.saveDraft({} as any);
      //assert
      expect(result.status).toBeFalsy();
      expect(result.message).toEqual('no config to save');
      service.loading$.subscribe((loading) => {
        expect(loading.show).toBeFalse();
      });
    });

    it('should start on saveDraft', async () => {
      //arrange
      service['config'] = { businessContext: { isFirmRequest: true }, contacts: [], staffs: [] } as any;
      mockEnvelopeService.save.and.returnValue(Promise.resolve({ requestManagerId: 'test123' } as any));
      //act
      const result = await service.saveDraft({
        contactsViewModel: {
          envelopeId: 'test123',
          recipientType: FirmIndividualType.FIRM,
          selectedContactsForFirm: [],
          selectedStaffs: [],
          lstAttachments: [],
        },
        itemsViewModel: { items: [] },
      } as any);
      //assert
      expect(result.status).toBeTrue();
      expect(result.message).toEqual('Successfully updated the draft test123.');
      service.loading$.subscribe((loading) => {
        expect(loading.show).toBeFalse();
      });
    });
  });
  describe('deleteDraft', () => {
    it('should return false if no view on deleteDraft', async () => {
      //arrange
      //act
      const result = await service.deleteDraft(null);
      //assert
      expect(result).toBeNull();
    });
    it('should return true if view on deleteDraft', async () => {
      //arrange
      const view = { contactsViewModel: { envelopeId: 'test123' } } as any;
      mockEnvelopeService.delete.and.returnValue(Promise.resolve(void 0));
      //act
      const result = await service.deleteDraft(view);
      //assert
      expect(result).toEqual({ good: true, message: 'undefined' });
    });
  });
  describe('publish', () => {
    it('should return false if no view on publish', async () => {
      //arrange
      //act
      const result = await service.publish(null);
      //assert
      expect(result).toEqual({ good: false, message: 'no data' });
    });
    it('should return false if no view on publish', async () => {
      //arrange
      service['config'] = { businessContext: { isFirmRequest: true }, contacts: [], staffs: [] } as any;
      mockEnvelopeService.publish.and.returnValue(Promise.resolve({} as any));

      const view = {
        contactsViewModel: {
          envelopeId: 'test123',
          recipientType: FirmIndividualType.FIRM,
          selectedContactsForFirm: [],
          selectedStaffs: [],
          lstAttachments: [],
        },
        itemsViewModel: { items: [] },
      } as any;
      //act
      const result = await service.publish(view);
      //assert
      expect(result).toEqual({ good: true, message: '' });
    });
  });
  describe('fetchInternalContactsByName', () => {
    it('should return correct result', async () => {
      //arrange
      const data = [
        { fields: { ac_finra_users_fullname: 'test', ac_source_id: 'test', ac_finra_users_email_address: 'test' } },
      ] as any;
      mockFirmRequestService.fetchInternalContacts.and.returnValue(Promise.resolve(data));
      //act
      const result = await service.fetchInternalContactsByName('test');

      //assert
      expect(result).toEqual([
        {
          fullName: 'test',
          userId: 'test',
          role: '',
          primaryFlag: false,
          email: 'test',
        },
      ] as any);
    });
    it('should return correct result by searchterm', async () => {
      //arrange
      const data = [
        { fields: { ac_finra_users_fullname: 'test', ac_source_id: 'test', ac_finra_users_email_address: 'test' } },
      ] as any;
      mockFirmRequestService.fetchInternalContacts.and.returnValue(Promise.resolve(data));
      //act
      const result = await service.fetchInternalContacts('test');

      //assert
      expect(result).toEqual(data as any);
    });
  });
  xit('should set values on editEnvelopeObject', () => {
    //arrange
    const envelope = {
      envelopeId: 'test123',
      draftPayload: { templateId: 'test' },
    } as any;
    //act
    service.editEnvelopeObject(envelope);
    //assert
    service['selectedTemplate$'].subscribe((sel) => {
      expect(sel?.id).toEqual('test');
    });
  });
  it('should set values on editEnvelope', () => {
    //arrange
    const envelope = {
      envelopeId: 'test123',
      draftPayload: { templateId: 'test' },
    } as any;
    mockEnvelopeService.find.and.returnValue(of(envelope));
    //act
    service.editEnvelope(envelope.envelopId);
    //assert
    expect(mockEnvelopeService.find).toHaveBeenCalledOnceWith(envelope.envelopId);
  });
  it('should return envelope ViewModel on editEnvelope', () => {
    const envelope = {
      envelopeId: 'test123',
      draftPayload: {
        templateId: 'test',
        requestAssignees: { lstFirmData: [{ id: 123, name: 'firm' }] },
      },
    } as any;
    mockEnvelopeService.find.and.returnValue(of(envelope));
    service.editEnvelope('test123');

    service.envelopeViewModel$.subscribe((viewModel) => {
      console.log(viewModel);
      expect(viewModel?.contactsViewModel.envelopeId).toEqual('test123');
    });
  });
});
