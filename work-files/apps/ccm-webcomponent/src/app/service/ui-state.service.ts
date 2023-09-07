import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  lastValueFrom,
  map,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ConfigurationApiService } from '../api/configuration/configuration.api.service';
import { ItemActionType } from '../api/envelope/enums/item-actions';
import { formatDateWithTime } from '../api/envelope/envelope-helper';
import { Envelope, RequestTemplate, TagsDto } from '../api/envelope/envelope.api.interface';
import { EnvelopeService } from '../api/envelope/envelope.api.service';
import { ItemTemplateApi } from '../api/envelope/template.api.interface';
import { ConfigurationSettingConstants } from '../common/constants/configuration-settings.constants';
import { REGULATORY_INQUIRIES } from '../common/constants/envelope.constants';
import { DashboardQueryMapper } from '../common/converters/dashboard-query.mapper';
import { dataRequestContactsMapper } from '../common/converters/data-request-contacts.mapper';
import { envelopeMapper } from '../common/converters/envelope-to-view-model.mapper';
import { eventsFromPatchMapper } from '../common/converters/events-from-patch.mapper';
import { eventsMapper } from '../common/converters/events.mapper';
import { ViewModelSource, mapList } from '../common/converters/mappers';
import { primaryContactForFirmMapper } from '../common/converters/primary-contact.mapper';
import { staffInternalContactMapper } from '../common/converters/staff-InternalContact.mapper';
import { transferDataMapper } from '../common/converters/transfer-data.mapper';
import { ViewModelToEnvelopeMapper } from '../common/converters/view-model-to-envelope.mapper';
import { ConfigurationSettings } from '../common/models/settings.model';
import { Alert } from '../firm-request/alert/alert.service';
import { ComposerView } from '../firm-request/enums/composer-view';
import { EnvelopeViewModel, ItemDataViewModel, ItemEventViewModel } from '../firm-request/models/envelope-view-model';
import { ItemAction, ItemActionRequest } from '../firm-request/models/item-action-request.model';
import { ItemTemplateDataModel } from '../firm-request/models/item-template-data.model';
import { LoadingModel } from '../firm-request/models/loading.model';
import {
  KeyValuePair,
  PatchAssignees,
  PatchBase,
  PatchData,
  PatchRequest,
  PatchSecurityLevels,
  PatchStatus,
  PatchTags,
} from '../firm-request/models/patch-request.model';
import { RequestTemplateDataModel } from '../firm-request/models/request-template-data.model';
import { RequestModel } from '../firm-request/models/request.model';
import { FirmRequestService, InternalContact } from '../firm-request/service/firm-request.service';
import { ActionStatuses, ITEM_ACTIONS } from './action-statuses-data';
import { ApiSentryService } from './api.sentry.service';
import { ConfigFacade } from './config/config.facade';
import { AccessPolicyToApply, Config, Contacts, Staffs } from './config/config.interface';
import { LogService } from './log.service';
import { UiLoadingIndicatorService } from './ui-loading-indicator.service';

@Injectable({
  providedIn: 'root',
})
export class UiStateService {
  constructor(
    private readonly firmRequestService: FirmRequestService,
    private readonly envelopeApiService: EnvelopeService,
    private readonly configFacade: ConfigFacade,
    private readonly apiSentryService: ApiSentryService,
    private readonly configurationApiService: ConfigurationApiService,
    private readonly uiLoadingIndicatorService: UiLoadingIndicatorService,
    private readonly log: LogService
  ) {}
  private config: Config | null = null;

  public loadingIndicator$ = this.uiLoadingIndicatorService.loadingIndicator$;
  private accessPolicyId: string = '';
  private selectedFirmSubject = new BehaviorSubject<Contacts>({} as Contacts);
  public selectedFirm$ = this.selectedFirmSubject.asObservable();
  private associatedFirmSubject = new BehaviorSubject<Contacts>({} as Contacts);
  public associatedFirm$ = this.associatedFirmSubject.asObservable();

  public selectedOrAssociatedFirm$ = combineLatest([this.selectedFirm$, this.associatedFirm$]).pipe(
    map(([selectedFirm, associatedFirm]) => {
      return associatedFirm?.crdId ? associatedFirm : selectedFirm;
    })
  );

  public config$ = this.configFacade.config$.pipe(tap((config) => (this.config = config)));

  private alertSubject: BehaviorSubject<Alert | null> = new BehaviorSubject<Alert | null>(null);
  public alert$ = this.alertSubject.asObservable();

  private loadingSubject: BehaviorSubject<LoadingModel> = new BehaviorSubject<LoadingModel>({
    show: false,
    message: '',
  } as LoadingModel);
  public loading$ = this.loadingSubject.asObservable();

  private policyId$ = this.config$.pipe(
    switchMap((config) =>
      this.apiSentryService
        .fetchAccessPolicyId(config.accessPolicyToApply.tag)
        .pipe(tap((policyId) => (this.accessPolicyId = policyId)))
    )
  );

  private groupSettings$ = this.configurationApiService.getConfiguration().pipe(
    map((values) => {
      if (!values) return { enabledDefaultTemplate: false };
      const enabledDefaultTemplateObj = values.find(
        (value: any) => value.key === ConfigurationSettingConstants.FEATURE_SKIP_RM_TEMPLATE_DIALOG
      );
      const enabledDefaultTemplate = enabledDefaultTemplateObj ? JSON.parse(enabledDefaultTemplateObj.value) : false;
      const defaultTemplateName = values.find(
        (value: any) => value.key === ConfigurationSettingConstants.FEATURE_DEFAULT_RM_TEMPLATE_NAME
      )?.value;
      const enabledEnvelopeLocalImport = values.find(
        (value: any) => value.key === ConfigurationSettingConstants.FEATURE_ENVELOPE_LOCAL_IMPORT
      )?.value;
      return { enabledDefaultTemplate, defaultTemplateName, enabledEnvelopeLocalImport };
    })
  );

  private currentUser$ = this.apiSentryService
    .getOrRegisterActor()
    .pipe(catchError((error) => of({ username: null, error: error })));

  public configurationSettings$: Observable<ConfigurationSettings> = combineLatest([
    this.config$,
    this.policyId$,
    this.groupSettings$,
    this.currentUser$,
  ]).pipe(
    map(([config, policyId, groupSettings, currentUser]) => {
      const value: ConfigurationSettings = {
        config: config,
        enabledDefaultTemplate: groupSettings?.enabledDefaultTemplate,
        defaultTemplateName: groupSettings.defaultTemplateName,
        enabledEnvelopeLocalImport: groupSettings.enabledEnvelopeLocalImport,
        currentUser,
      };
      value.config.accessPolicyToApply = { ...config.accessPolicyToApply, id: policyId } as AccessPolicyToApply;
      this.log.info('uiStateService.configurationSettings', value); // Helg. To capture what RCM is giving to us.
      return value;
    })
  );

  private selectedEnvelopeSubject = new ReplaySubject<Envelope>();
  private selectedEnvelope$ = this.selectedEnvelopeSubject.asObservable();

  private selectedTemplateIdSubject = new BehaviorSubject<string>('0');
  private selectedTemplateId$ = this.selectedTemplateIdSubject.pipe(distinctUntilChanged());

  private selectedTemplateSubject = new ReplaySubject<RequestTemplate>();
  private selectedTemplate$ = this.selectedTemplateId$.pipe(
    switchMap((id) =>
      id != '0'
        ? this.firmRequestService.getRequestTemplate(id).pipe(distinctUntilChanged())
        : of({ id: '0' } as any as RequestTemplate)
    )
  );

  private currentViewSubject = new BehaviorSubject<ComposerView>(ComposerView.INTRO);
  public currentView$ = this.currentViewSubject.asObservable();

  private _envelopeViewModel$ = combineLatest([this.selectedEnvelope$, this.config$, this.selectedTemplate$]).pipe(
    filter(
      ([envelope, config, selectedTemplate]) =>
        !!envelope && !!config && (envelope.isPublished || selectedTemplate.id != '0')
    ),
    map(([envelope, config, selectedTemplate]) => {
      try {
        const source = { envelope, config, selectedTemplate } as ViewModelSource;
        const viewModel = envelopeMapper(source);
        if (viewModel.contactsViewModel?.selectedFirm) {
          this.selectedFirmSubject.next(viewModel.contactsViewModel.selectedFirm);
        } else {
          this.selectedFirmSubject.next({} as Contacts);
        }
        return viewModel as EnvelopeViewModel;
      } catch (error) {
        this.loadingOff();
        this.showRedAlert(error ? JSON.stringify(error) : 'Unknown Error');
        this.changeViewToIntro();
        throw error;
      }
    })
  );

  private contactsByFirmsSubject = new BehaviorSubject<{ firm: Contacts; contacts: Contacts[] }[]>([]);
  private contactsForFirm$ = this.selectedFirm$.pipe(
    switchMap((firm) => {
      return firm ? this.getContactsForFirm(firm) : [];
    })
  );

  public envelopeViewModel$: Observable<EnvelopeViewModel | null> = combineLatest([
    this._envelopeViewModel$,
    this.contactsForFirm$,
  ]).pipe(
    map(([viewModel, contacts]) => {
      if (!viewModel) return null;
      viewModel.contactsViewModel.contactsForFirm = contacts || [];
      viewModel.contactsViewModel.selectedContactsForFirm = primaryContactForFirmMapper(viewModel, contacts || []);
      viewModel.accessPolicyId = this.accessPolicyId;
      this.loadingOff();
      if (viewModel.itemsViewModel.items.length > 0) {
        this.selectItem(viewModel.itemsViewModel.items[0]);
      }
      return viewModel;
    }),
    shareReplay(1)
  );

  private selectedItemSubject = new BehaviorSubject<ItemDataViewModel | null>(null);
  public selectedItem$ = this.selectedItemSubject.asObservable();

  public itemActions$: Observable<ActionStatuses[]> = this.selectedItem$.pipe(
    map((itemModel: ItemDataViewModel | null) => {
      if (!itemModel) return [];
      let withTags = ITEM_ACTIONS.filter(
        (action) =>
          action.statuses.find(
            (status) => status.toLowerCase() === itemModel.item.status?.toLowerCase() || status === 'All'
          ) && action.itemType === ItemActionType.WITH_TAGS
      );
      let list: ActionStatuses[] =
        ITEM_ACTIONS.filter(
          (action) =>
            action.statuses.find(
              (status) => status.toLowerCase() === itemModel.item.status?.toLowerCase() || status === 'All'
            ) && action.itemType !== ItemActionType.WITH_TAGS
        ) || [];
      itemModel.item.tags?.forEach((value: TagsDto) => {
        withTags = withTags.filter((action) => action.tag !== value.key);
      });
      if (withTags.find((action) => action.tag === 'CAT')) {
        withTags = withTags.filter((action) => action.tag !== 'REMOVE-CAT');
      }
      itemModel.item.securityLevels?.forEach((level: string) => {
        list = list.filter((action) => action.tag !== level);
      });
      if (list.find((action) => action.tag === 'RCI')) {
        list = list.filter((action) => action.tag !== 'REMOVE-RCI');
      }

      return list.concat(withTags).sort((a, b) => (a.name < b.name ? -1 : 1));
    })
  );

  public selectedItemEvents$: Observable<ItemEventViewModel[]> = this.selectedItem$.pipe(
    map((itemModel: ItemDataViewModel | null) => {
      if (!itemModel) return [];
      const events = eventsMapper(itemModel.item.events);
      return events;
    })
  );

  private recommendedTemplates$ = this.config$.pipe(
    switchMap((config) =>
      this.firmRequestService.fetchRequestManagerTemplatesForCaseId(config.businessContext.businessId)
    )
  );

  private relevantTemplates$ = this.firmRequestService.fetchRequestManagerTemplatesAll();

  public requestTemplates$: Observable<RequestTemplateDataModel> = combineLatest([
    this.recommendedTemplates$,
    this.relevantTemplates$,
  ]).pipe(
    map(([recommended, relevant]) => {
      return { recommended, relevant } as RequestTemplateDataModel;
    }),
    shareReplay(1)
  );

  private loadingItemsForRequestSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loadingItemsForRequest$ = this.loadingItemsForRequestSubject.asObservable();

  public itemsForRequest$: Observable<ItemTemplateDataModel> = this.selectedTemplateId$.pipe(
    tap(() => this.loadingItemsForRequestSubject.next(true)),
    switchMap((selectedTemplateId) =>
      this.firmRequestService.fetchRequestManagerItemsForRequestTemplateId(selectedTemplateId).pipe(
        map((data1) => {
          data1.unshift(ItemTemplateApi.ADHOC_ITEM_TEMPLATE_API);
          this.loadingItemsForRequestSubject.next(false);
          return { recommended: data1, all: data1 } as ItemTemplateDataModel;
        })
      )
    ),
    shareReplay(1)
  );

  //TODO: redo to match the other method: this when API is ready and remove the other code that sets data$
  // this.data$ = forkJoin([this.firmRequestService.fetchRequestManagerItemsForRequestTemplateId(this.requestTemplateId),
  //   this.firmRequestService.fetchRequestManagerItemsNoRequestTemplateId()]).pipe(
  //     map(([data1, data2]) => {
  //       data1.unshift(this.adHocItem);
  //       data2.unshift(this.adHocItem);
  //       return { recommended: data1, all: data2 } as ItemTemplateDataModel;
  //     }),
  //     finalize(() => this.loading = false),
  //     shareReplay(1)
  //   );

  private changeViewToCreate(isCreateNewEnvelope: boolean) {
    this.currentViewSubject.next(ComposerView.CREATE_ENVELOPE);
    this.alertSubject.next({ show: false });
  }
  private changeViewToIntro() {
    this.currentViewSubject.next(ComposerView.INTRO);
  }
  private selectEnvelope(envelope: Envelope) {
    if (envelope?.draftPayload?.templateId) this.selectedTemplateIdSubject.next(envelope?.draftPayload?.templateId);
    this.selectedEnvelopeSubject.next(envelope);
  }

  createEnvelope(template: RequestTemplate) {
    this.loadingOn();
    this.selectedTemplateIdSubject.next(template.id);
    this.selectedEnvelopeSubject.next({} as Envelope);
    this.changeViewToCreate(true);
  }

  selectItem(item: ItemDataViewModel | null) {
    this.selectedItemSubject.next(item);
  }

  updateItemAction(patch: PatchRequest): Observable<ItemDataViewModel | null> {
    this.loadingOn();

    const internalId = patch.itemModel.item.entityId || 0;
    const envelopeId = patch.viewModel.contactsViewModel.envelopeId;

    if (!envelopeId) {
      this.log.error('something is wrong with item, it has no envelope id');
      this.loadingOff();
      return of(null);
    }

    const itemModel = {
      ...patch.viewModel.itemsViewModel.items.find((model) => model.item.entityId === internalId),
    } as ItemDataViewModel;

    if (!itemModel) {
      this.log.error('somethig is wrong with item, item is not in the payload');
      this.loadingOff();
      return of(null);
    }

    let patchData: PatchBase = this.getPatchData(patch, itemModel);

    if (patch.action.itemType === ItemActionType.WITH_TAGS) {
      const list = this.getItemTags(patch);
      patchData = { tags: list } as PatchTags;
      itemModel.item.tags = [];
      list.map((tag) => itemModel.item.tags?.push({ key: tag.key, value: '' } as TagsDto));
    }

    if (patch.action.itemType === ItemActionType.WITH_UPDATE || patch.action.itemType === ItemActionType.WITH_DATE) {
      if (!patch.action.updateName) {
        console.error('something is wrong with action, it has no updateName, like {aos?}');
        this.loadingOff();
        return of(null);
      }
      const request = { itemId: itemModel.item.entityId, comments: patch.note } as ItemActionRequest;

      if (patch.action.itemType === ItemActionType.WITH_DATE) {
        request.dueDate = formatDateWithTime(patch.date);
        itemModel.item.dueDate = patch.date;
      }

      return this.envelopeApiService.updateAction(envelopeId, [request], patch.action.updateName).pipe(
        map((_) => {
          const newItem = { ...itemModel } as ItemDataViewModel;
          if (patch.action.updateName === ItemAction.aos) {
            newItem.item.status = patch.action.status;
            newItem.partiallySubmitted = false;
          }
          newItem.item.events = eventsFromPatchMapper(patch, newItem.item.events);
          this.selectItem(newItem);
          patch.viewModel.itemsViewModel.items.forEach((i) => {
            if (i.item.entityId === itemModel.item.entityId) {
              i.item.status = newItem.item.status;
              i.item.dueDate = newItem.item.dueDate;
              if (patch.action.updateName === ItemAction.aos) {
                i.partiallySubmitted = false;
              }
            }
          });
          this.loadingOff();
          return newItem;
        }),
        catchError(() => {
          this.loadingOff();
          return of(null);
        })
      );
    }
    return this.envelopeApiService.patch(envelopeId, 'ITEM', internalId, patchData as PatchData).pipe(
      map((newEnvelope) => {
        if (!newEnvelope) {
          this.loadingOff();
          return null;
        }
        if (
          itemModel.partiallySubmitted &&
          (patch.action.updateName === ItemAction.reject || patch.action.updateName === ItemAction.withdraw)
        ) {
          itemModel.partiallySubmitted = false;
        }

        itemModel.catFlag = false;
        itemModel.item.tags?.forEach((tag: TagsDto) => {
          if (tag.key === 'CAT') itemModel.catFlag = true;
        });
        itemModel.rciFlag = itemModel.item.securityLevels?.some((level: string) => level === 'RCI') || false;
        const newItem = { ...itemModel } as ItemDataViewModel;
        patch.viewModel.itemsViewModel.items = [
          ...patch.viewModel.itemsViewModel.items.map((it: ItemDataViewModel) => {
            if (it.item.entityId === itemModel.item.entityId) {
              it = { ...itemModel };
              it.catFlag = itemModel.catFlag;
            }
            return it;
          }),
        ];
        newItem.item.events = eventsFromPatchMapper(patch, newItem.item.events);
        this.selectItem(newItem);
        this.loadingOff();
        return newItem;
      }),
      catchError(() => {
        this.loadingOff();
        return of(null);
      })
    );
  }
  getItemTags(patch: PatchRequest): KeyValuePair[] {
    let list: KeyValuePair[] = [];
    patch.itemModel.item.tags?.forEach((value: TagsDto) => {
      list.push({ key: value.key, value: value.value } as KeyValuePair);
    });
    if (patch.action.tag?.startsWith('REMOVE')) {
      const key = patch.action.tag?.split('-')[1];
      list = list.filter((value: KeyValuePair) => value.key !== key);
    } else {
      list.push({ key: patch.action.tag, value: '' } as KeyValuePair);
    }

    return list;
  }
  getPatchData(patch: PatchRequest, itemModel: ItemDataViewModel): PatchBase {
    let patchData: PatchBase = {} as PatchBase;

    if (patch.action.itemType === ItemActionType.WITH_STATUS) {
      patchData = { updateReason: patch.note, status: patch.action.status } as PatchStatus;
      itemModel.item.status = patch.action.status;
    }
    if (patch.action.itemType === ItemActionType.WITH_SECURITY) {
      const securityLevels = patch.action.tag === 'RCI' ? ['RCI'] : ['NONE'];
      patchData = { updateReason: patch.note, securityLevels: securityLevels } as PatchSecurityLevels;
      itemModel.item.securityLevels = securityLevels;
    }
    return patchData;
  }

  private loadingOn(message: string = 'Loading...') {
    this.loadingSubject.next({ show: true, message });
  }
  private loadingOff() {
    this.loadingSubject.next({ show: false, message: '' });
  }

  showRedAlert(message: string, withClose: boolean = false, closeFunc?: { (): void }, closeThis?: Object) {
    this.hideAlert();
    this.alertSubject.next({
      message,
      show: true,
      type: 'error',
      withClose,
      onClose: closeFunc,
      onCloseThis: closeThis,
    });
  }
  showGreenAlert(message: string, withClose: boolean = false, closeFunc?: { (): void }, closeThis?: Object) {
    this.hideAlert();
    this.alertSubject.next({
      message,
      show: true,
      type: 'success',
      withClose,
      onClose: closeFunc,
      onCloseThis: closeThis,
    });
  }
  hideAlert() {
    this.alertSubject.next({ show: false });
  }

  selectFirm(firm: Contacts) {
    this.selectedFirmSubject.next(firm);
  }

  associateFirm(firm: Contacts) {
    this.associatedFirmSubject.next(firm);
  }

  async saveDraft(view: EnvelopeViewModel | null): Promise<{ status: boolean; message: string }> {
    this.hideAlert();
    if (!view) return { status: false, message: 'no envelope to save' };
    if (!this.config) return { status: false, message: 'no config to save' };
    this.loadingOn('Saving...');
    const envelope = ViewModelToEnvelopeMapper.toEnvelope(view, this.config);
    const isNew = view?.contactsViewModel.isNew;
    if (!isNew && !envelope.envelopeId) throw new Error('Internal error: saved envelope does not have id');

    try {
      var envelopePayload = await this.envelopeApiService.save(envelope);
      this.selectEnvelope(envelopePayload);
      return {
        status: true,
        message: `Successfully ${isNew ? 'saved' : 'updated'} the draft ${envelopePayload.requestManagerId}.`,
      };
    } catch (error: any) {
      return {
        status: false,
        message: JSON.parse(error.error.message)?.message || `${isNew ? 'save' : 'update'} failed`,
      };
    } finally {
      this.loadingOff();
    }
  }

  async deleteDraft(view: EnvelopeViewModel | null): Promise<RequestModel | null> {
    if (!view) return null;
    this.alertSubject.next({ show: false });
    const envelopeId: any = view.contactsViewModel.envelopeId;
    this.loadingOn('Deleting...');

    return await this.envelopeApiService
      .delete(envelopeId)
      .then((result) => {
        this.loadingOff();
        this.changeViewToIntro();
        return { good: true, message: `${result}` };
      })
      .catch((error) => {
        this.loadingOff();
        return { good: false, message: JSON.parse(error.error.message).message };
      });
  }
  async publish(view: EnvelopeViewModel | null): Promise<RequestModel> {
    this.hideAlert();
    if (!view) {
      return new Promise((resolve) => {
        resolve({ good: false, message: 'no data' });
      });
    }
    if (!this.config) {
      return new Promise((resolve) => {
        resolve({ good: false, message: 'no config data' });
      });
    }
    this.loadingOn('Publishing...');
    const envelope = ViewModelToEnvelopeMapper.toEnvelope(view, this.config);
    return this.envelopeApiService
      .publish(envelope)
      .then((response: any) => {
        this.selectEnvelope(response);
        this.loadingOff();
        return { good: true, message: '' };
      })
      .catch((error) => {
        this.loadingOff();
        return new Promise((resolve) => {
          resolve({ good: false, message: JSON.parse(error.error.message).message });
        });
      });
  }
  async fetchInternalContactsByName(fullName: string): Promise<Staffs[]> {
    this.uiLoadingIndicatorService.show();
    return await this.firmRequestService
      .fetchInternalContacts(fullName)
      .then((response: InternalContact[]) => {
        this.uiLoadingIndicatorService.hide();
        return mapList(staffInternalContactMapper)(response);
      })
      .catch((error) => {
        this.showRedAlert(JSON.parse(error.error?.message).message || 'no email is found', true);
        this.uiLoadingIndicatorService.hide();
        return new Promise((resolve) => {
          resolve([]);
        });
      });
  }

  private getContactsForFirm(firm: Contacts): Observable<Contacts[]> {
    if (!firm || !firm.crdId) return of([]);
    this.uiLoadingIndicatorService.show();
    if (!this.contactsByFirmsSubject.value.find((item) => item.firm.crdId === firm.crdId + '')) {
      return this.firmRequestService.fetchContactsOfFirm(firm.crdId).pipe(
        map((contacts) => {
          const list = this.contactsByFirmsSubject.value;
          contacts.forEach((cc) => {
            const roleContacts = cc.roleContacts || [];
            const regultoryRole = roleContacts.find((role: any) => role.role.name === REGULATORY_INQUIRIES);
            cc.primaryFlag = regultoryRole ? true : false;
          });
          list.push({ firm, contacts });
          this.contactsByFirmsSubject.next(list);
          this.uiLoadingIndicatorService.hide();
          return contacts;
        })
      );
    }
    this.uiLoadingIndicatorService.hide();
    return of(this.contactsByFirmsSubject.value.find((item) => item.firm.crdId === firm.crdId + '')?.contacts || []);
  }

  async editEnvelopeObject(envelope: Envelope) {
    this.selectedTemplateSubject.next({ id: envelope.draftPayload.templateId } as RequestTemplate);
    this.selectEnvelope(envelope);
    this.changeViewToCreate(false);
  }

  async editEnvelope(id: string) {
    this.loadingOn();
    const envelope = await this.find(id);
    this.editEnvelopeObject(envelope);
  }

  start() {
    this.changeViewToIntro();
  }

  public search(params: any): Observable<{ envelopes: Envelope[]; total: number }> {
    if (!this.config) {
      throw new Error('Internal error: config is not set');
    }
    const businessContext = this.config.businessContext;
    const query = DashboardQueryMapper.paramsToQueryMapper(params, businessContext);
    return (
      this.envelopeApiService
        .search(query)
        // .pipe(take(1))
        .pipe(
          map((response) => this.formatSearchResponse(response)),
          catchError((searchError) => {
            console.error({ searchError });
            return of({
              envelopes: [],
              total: 0,
            } as any);
          })
        )
    );
  }

  private async find(id: string): Promise<Envelope> {
    return await lastValueFrom(
      this.envelopeApiService
        .find(id)
        .pipe(take(1))
        .pipe(
          map((envelope) => {
            this.selectedEnvelopeSubject.next(envelope);
            return envelope;
          })
        )
    );
  }

  private formatSearchResponse(response: any) {
    let mapResponse: Envelope[] = [];
    if (response.hits && response.hits.hits) {
      response.hits.hits.forEach((hit: any) => {
        mapResponse.push(hit._source);
      });
    }
    return {
      envelopes: mapResponse,
      total: response.hits?.total.value,
    };
  }

  async publishChanges(view: EnvelopeViewModel | null): Promise<RequestModel> {
    if (!view) {
      return new Promise((resolve) => {
        resolve({ good: false, message: 'no data' });
      });
    }
    this.loadingOn('Publishing...');
    const data = dataRequestContactsMapper(view.requestManagerId, view.contactsViewModel);
    return this.envelopeApiService
      .publishChanges(view.contactsViewModel.envelopeId, data)
      .then((response: any) => {
        this.loadingOff();
        return { good: true, message: `Contacts are updated for request ${view.requestManagerId}` };
      })
      .catch((error) => {
        this.loadingOff();
        return new Promise((resolve) => {
          resolve({ good: false, message: JSON.parse(error.error.message).message });
        });
      });
  }

  public async fetchInternalContacts(searchTerm: string): Promise<InternalContact[]> {
    return await this.firmRequestService.fetchInternalContacts(searchTerm);
  }

  transfer(viewModel: EnvelopeViewModel): Observable<RequestModel> {
    this.loadingOn('Saving...');
    let patchData = { assignees: [], notifications: [] } as PatchAssignees;
    patchData = transferDataMapper(viewModel);

    return this.envelopeApiService
      .patch(viewModel.contactsViewModel.envelopeId, 'REQUEST', +viewModel.requestManagerId, patchData)
      .pipe(
        map((newEnvelope) => {
          if (!newEnvelope) {
            this.loadingOff();
            return {
              good: false,
              message: `Request ${viewModel.requestManagerId} was not transferred.`,
            } as RequestModel;
          }
          this.loadingOff();
          return { good: true, message: `Request ${viewModel.requestManagerId} is transferred.` } as RequestModel;
        }),
        catchError(() => {
          this.loadingOff();
          return of({
            good: false,
            message: `Request ${viewModel.requestManagerId} was not transferred.`,
          } as RequestModel);
        })
      );
  }
}
