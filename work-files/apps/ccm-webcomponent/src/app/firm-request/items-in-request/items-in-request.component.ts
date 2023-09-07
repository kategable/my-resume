import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiHostService } from '../../service/api.host.service';
import { AttachmentData, ItemData, ItemType } from '../../api/envelope/envelope.api.interface';
import { RmAttachmentService, UploadStatus } from '../../service/rm-attachment.service';
import { ConfigurationApiFacade } from '../../api/configuration/configuration.api.facade';
import { ConfigFacade } from '../../service/config/config.facade';
import { Config, Contacts, Staffs } from '../../service/config/config.interface';
import { AlfWebComponentService } from '../../service/alf-web-components.service';
import { UiStateService } from '../../service/ui-state.service';
import { templateMapper } from '../../common/converters/template-to-item.mapper';
import { EnvelopeViewModel, ItemDataViewModel, ItemsViewModel } from '../models/envelope-view-model';
import { ItemTemplateApi } from '../../api/envelope/template.api.interface';
import { toIsoString, validateDate } from '../../api/envelope/envelope-helper';
import { BehaviorSubject, Observable, filter, map, of, switchMap, tap } from 'rxjs';
import { FirmRequestService } from '../service/firm-request.service';
import { UiLoadingIndicatorService } from '../../service/ui-loading-indicator.service';
import { ExternalAttachmentModel } from '../models/external-attachments.model';
import EnvelopeStatus from '../enums/envelope-status';
import { lessThanToday } from '../item-actions-update/custom-validator';

@Component({
  selector: 'app-items-in-request',
  templateUrl: './items-in-request.component.html',
  styleUrls: ['./items-in-request.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ItemsInRequestComponent implements OnInit {
  DRAFT = EnvelopeStatus.DRAFT;
  config = new Config();
  visited: any = [];
  showDeleteConfirmation = false;
  showSidePanel = true;
  attachmentBaseUrl = '';
  itemIndex = 0;
  externalAttachment: ExternalAttachmentModel = {
    show: false,
    text: '',
    type: '',
  };
  selectedIndex: number = -1;
  ItemType = ItemType;
  selectedDeleteIndex: number = -1;
  selectedItem$ = this.uiStateService.selectedItem$;
  viewModel$ = this.uiStateService.envelopeViewModel$.pipe(
    tap((view: EnvelopeViewModel | null) => {
      if (!view) return;
      this.visited = [];
      this.visited = view.itemsViewModel.items.map(() => ({
        itemName: false,
        itemType: false,
        asOfDate: false,
        startDate: false,
        endDate: false,
        dueDate: false,
        user: false,
        adhocItemCategory: false,
      }));
    }),
    filter((view: EnvelopeViewModel | null) => !!view)
  );
  seletedItemsCount: number = 0;
  showBulkUpdatePanel: boolean = false;
  constructor(
    private configFacade: ConfigFacade,
    private configurationApiFacade: ConfigurationApiFacade,
    private alfWebComponentService: AlfWebComponentService,
    private rmAttachmentService: RmAttachmentService,
    private apiHostService: ApiHostService,
    private readonly uiStateService: UiStateService,
    readonly uiLoadingIndicatorService: UiLoadingIndicatorService,
    private readonly firmRequestService: FirmRequestService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.attachmentBaseUrl = this.apiHostService.baseUrl + '/outbox-api/request-manager-attachment/';
  }

  itemTemplateCategories$ = this.firmRequestService.adhocItemTemplateCategories$;

  ngOnInit(): void {
    this.configFacade.config$.subscribe((config) => {
      this.config = config;
    });

    this.configurationApiFacade.businessContext$.subscribe((businessContext) => {
      this.externalAttachment = {
        show: businessContext.contentStorage?.storageProviderName === 'alfresco',
        text: businessContext.contentStorage?.description?.brief || '',
        type: businessContext.contentStorage?.contextTypeName || '',
      };
    });
  }

  clearingFirms$: Observable<Contacts[]> = this.uiStateService.selectedOrAssociatedFirm$.pipe(
    switchMap((firm) => this.getClearingFirms(firm))
  );

  private clearingFirmsSubject = new BehaviorSubject<{ firmId: string; firms: Contacts[] }[]>([]);

  getClearingFirms(firm: Contacts | null): Observable<Contacts[]> {
    if (!firm || !firm.crdId) return of([]);
    if (!this.clearingFirmsSubject.value.find((item) => item.firmId === firm.crdId + '')) {
      this.uiLoadingIndicatorService.show();
      return this.firmRequestService.fetchClearingFirmsOfFirm(firm.crdId).pipe(
        map((firms) => {
          const list = this.clearingFirmsSubject.value;
          const firmId = firm.crdId;
          list.push({ firmId, firms });
          // add self-clearing option if not alteady in the list
          if (!firms.find((f) => f.crdId == firm.crdId)) firms.unshift(firm);
          this.clearingFirmsSubject.next(list);
          this.uiLoadingIndicatorService.hide();
          return firms;
        })
      );
    }
    return of(this.clearingFirmsSubject.value.find((item) => item.firmId === firm.crdId + '')?.firms || []);
  }

  getRequest(index: number, viewModel: EnvelopeViewModel) {
    return viewModel!.itemsViewModel.items[index] || {};
  }

  onBlur($event: any, name: string, index: number) {
    if (!this.visited[index]) {
      this.visited[index] = {};
    }
    this.visited[index][name] = true;
  }

  onDateChange(
    $event: any,
    name: 'startDate' | 'endDate' | 'asOfDate' | 'dueDate',
    item: ItemData,
    viewModel: ItemsViewModel
  ) {
    item[name] = $event.detail;
    viewModel.changed = true;
  }

  onChange($event: any, name: 'itemName' | 'itemType' | 'notes', item: ItemData, viewModel: ItemsViewModel) {
    item[name] = $event.target.value;
    viewModel.changed = true;
  }

  onItemCategoryChange($event: any, item: ItemData, viewModel: ItemsViewModel) {
    item.adhocItemCategory = $event.detail.value;
    viewModel.changed = true;
  }

  async onAssignedToChange($event: any, model: ItemDataViewModel, viewModel: EnvelopeViewModel) {
    const detail = $event.detail.value;
    if (!detail || viewModel.isPublished) {
      return;
    }
    const selectedContact = detail;
    await this.updateSelectedContact(model, selectedContact, viewModel);
  }

  private async updateSelectedContact(model: ItemDataViewModel, selectedContact: Staffs, viewModel: EnvelopeViewModel) {
    if (!selectedContact) {
      return;
    }
    if (model.selectedAssignTo?.userId !== selectedContact.userId) {
      viewModel.itemsViewModel.changed = true;
    }
    model.selectedAssignTo = selectedContact;

    if (model.selectedAssignTo?.userId === selectedContact.userId || selectedContact.email) {
      return;
    }

    if (!selectedContact.email) {
      const intContactInfo: Staffs[] = await this.uiStateService.fetchInternalContactsByName(selectedContact.userId);
      if (intContactInfo && intContactInfo[0]) {
        model.selectedAssignTo.email = intContactInfo[0].email;
        viewModel.staff
          .filter((s) => s.userId === intContactInfo[0].userId)
          .forEach((staff) => {
            staff.email = intContactInfo[0].email;
          });
      }
    }
  }

  onClearningFirmChange($event: any, item: ItemDataViewModel, viewModel: ItemsViewModel) {
    const detail = $event.detail;
    if (!detail.text) {
      return;
    }
    const selectedClearingFirm = detail.value;
    if (selectedClearingFirm) {
      item.selectedClearingFirm = selectedClearingFirm;
      //TODO: to mapper
      // const formData: {
      //   clearingFirm: Firm;
      //   d2iFlag: boolean | undefined;
      //   hasClearingFirm: boolean | undefined;
      // } = {
      //   clearingFirm: this.selectedClearingFirm,
      //   d2iFlag: item.d2iFlag,
      //   hasClearingFirm: item.hasClearingFirm,
      // };
      // item.formData = JSON.stringify(formData);
      viewModel.changed = true;
    }
  }

  validateDate = validateDate;
  lessThanToday = lessThanToday;

  validateStartDate(index: number, item: ItemData) {
    let msg = '';
    const visitedItem = this.visited[index];
    if (visitedItem) {
      if (visitedItem.startDate && !item.startDate) {
        msg = 'Required';
      } else if (visitedItem.startDate && !this.validateDate(item.startDate)) {
        msg = 'Provide valid date';
      } else if (
        visitedItem.endDate &&
        this.validateDate(item.endDate) &&
        new Date(item.endDate || '') < new Date(item.startDate || '')
      ) {
        msg = 'Start date should not be after end date';
      }
    }
    return msg;
  }

  markInvalid(viewModel: EnvelopeViewModel) {
    this.visited = viewModel!.itemsViewModel.items.map(() => ({
      itemName: true,
      itemType: true,
      asOfDate: true,
      startDate: true,
      endDate: true,
      dueDate: true,
      user: true,
      adhocItemCategory: true,
    }));
  }

  onDelete(viewModel: ItemsViewModel) {
    const index = this.selectedIndex;
    viewModel.items.splice(index, 1);
    this.visited.splice(index, 1);
    this.onCancelDelete();
    viewModel.changed = true;
    this.updateBulkFlags(viewModel);
  }

  selectItem(index: number, viewModel: ItemsViewModel) {
    const selectedItem = viewModel.items[index];
    this.showSidePanel = true;
    this.toggleOpen(index, viewModel);
    selectedItem.selected = true;
    this.uiStateService.selectItem(selectedItem);
  }

  getSelectedCount(viewModel: EnvelopeViewModel) {
    return viewModel!.itemsViewModel.items.filter((request: ItemDataViewModel) => request.item.selected).length;
  }

  onRemoveSelectedItem(index: number) {
    this.selectedIndex = index;
    this.showDeleteConfirmation = true;
  }
  onCancelDelete() {
    this.showDeleteConfirmation = false;
  }

  toggleOpen(index: number, viewModel: ItemsViewModel) {
    viewModel.items.forEach((item: ItemDataViewModel, i: number) => {
      if (i !== index) {
        item.open = false;
        item.selected = false;
      }
    });
    viewModel.items[index].open = !viewModel.items[index].open;
    if (viewModel.items[index].open) {
      const selectedItem = viewModel.items[index];
      this.showSidePanel = true;
      selectedItem.selected = true;
      this.uiStateService.selectItem(selectedItem);
    }
  }

  onAttachLocalFiles($event: any, model: ItemDataViewModel, viewModel: EnvelopeViewModel) {
    const files: File[] = Object.assign([], $event?.target?.files) || [];
    if ($event.target) $event.target.value = null; // clear file selection - to allow attaching the same file again after deletion
    let attachments: any = Array.from(files).map((file: any) => ({
      filename: file.name,
      fileSize: file.size,
      contentType: file.type,
      uploadDate: toIsoString(new Date()),
      externalAttachmentUrl: '',
    }));
    this.attachFiles(files, attachments, model, viewModel.templateId);
    viewModel.itemsViewModel.changed = true;
  }

  async openFileSelection(model: ItemDataViewModel, viewModel: EnvelopeViewModel) {
    const files = await this.alfWebComponentService.showModal(
      this.externalAttachment.type,
      this.config.businessContext?.businessId
    );
    const newFiles: File[] = [];

    for (const file of files) {
      const newFile = await this.rmAttachmentService.downloadUrlToJsFile(
        this.apiHostService.convertUcfUrl(file.downloadUrl),
        file.name,
        new Date()
      );
      newFiles.push(newFile);
    }

    const attachments: any = Array.from(files).map((file: any) => ({
      filename: file.name,
      fileSize: file.size,
      contentType: file.mimeType,
      uploadDate: toIsoString(new Date()),
      externalAttachmentUrl: file.downloadUrl,
    }));
    this.attachFiles(newFiles, attachments, model, viewModel.templateId);
  }

  attachFiles(files: File[], attachments: AttachmentData[], model: ItemDataViewModel, templateId: string) {
    if (!templateId) {
      throw new Error('templateId is empty');
    }
    const itemAttachments = model.item.attachments || [];
    itemAttachments.push(...attachments);
    files.forEach(
      async (file: any) =>
        await this.rmAttachmentService
          .uploadFile(templateId, file, (status: UploadStatus) => {
            const currFile = attachments.find((f: any) => f.filename === file.name);
            if (currFile) {
              currFile.loaded = status.loaded;
              currFile.total = status.total;
            }
            this.changeDetectorRef.detectChanges();
          })
          .then((attachment: any) => {
            // set as done
            const currFile = attachments.find((f: any) => f.filename === file.name);
            if (currFile) {
              currFile.attachmentId = attachment.attachmentId;
              currFile.uploadStatus = attachment.uploadStatus;
            }
            this.changeDetectorRef.detectChanges();
          })
    );
  }

  onRemoveFile(fileIndex: number, index: number, viewModel: EnvelopeViewModel) {
    if (viewModel.isPublished) return;
    viewModel!.itemsViewModel.items[index].item.attachments.splice(fileIndex, 1);
    viewModel.itemsViewModel.changed = true;
  }

  getFileSize(index: number, fileIndex: number, viewModel: EnvelopeViewModel): number {
    return viewModel!.itemsViewModel.items[index].item.attachments[fileIndex].fileSize;
  }

  getAllFilesSize(index: number, viewModel: EnvelopeViewModel): number {
    return viewModel!.itemsViewModel.items[index].item.attachments.reduce(
      (a: number, c: AttachmentData) => c.fileSize + a,
      0
    );
  }

  getObjectUrl(file: File) {
    return URL.createObjectURL(file);
  }

  downloadFile(file: AttachmentData) {
    const link = document.createElement('a');
    link.href = `${this.attachmentBaseUrl}${file.attachmentId}`;
    link.download = file.filename;
    link.click();
  }

  onItemTypeSelect(template: ItemTemplateApi, viewModel: ItemsViewModel) {
    viewModel.items.map((item) => (item.open = false));
    const item = templateMapper(template);
    viewModel.items.push(item);
    viewModel.changed = true;
  }

  toggleItemTypeSelect() {
    this.showSidePanel = !this.showSidePanel;
  }

  onNoResponseChange(item: ItemData, viewModel: ItemsViewModel) {
    item.noResponse = !item.noResponse;
    item.itemType = item.noResponse ? ItemType.NON_DATE : ItemType.AS_OF_DATE;
    viewModel.changed = true;
  }
  onItemChecked(model: ItemDataViewModel, viewModel: ItemsViewModel) {
    model.selected = !model.selected;
    this.updateBulkFlags(viewModel);
  }

  private updateBulkFlags(viewModel: ItemsViewModel) {
    this.seletedItemsCount = viewModel.items.filter((item: ItemDataViewModel) => item.selected).length;
    this.showBulkUpdatePanel = this.seletedItemsCount > 1;
    if (this.showBulkUpdatePanel) this.showSidePanel = true;
  }

  bulkUpdate(model: ItemDataViewModel, viewModel: EnvelopeViewModel) {
    let wasChanged = false;
    viewModel.itemsViewModel.items.forEach(async (itemData: ItemDataViewModel) => {
      if (itemData.selected) {
        if (model.selectedAssignTo) {
          wasChanged = true;
          await this.updateSelectedContact(itemData, model.selectedAssignTo, viewModel);
          viewModel.itemsViewModel.changed = true;
        }
        if (model.item.dueDate) {
          itemData.item.dueDate = model.item.dueDate;
          itemData.item.noResponse = false;
          wasChanged = true;
          viewModel.itemsViewModel.changed = true;
        }
        if (model.item.asOfDate && model.item.itemType === ItemType.AS_OF_DATE) {
          itemData.item.itemType = model.item.itemType;
          itemData.item.asOfDate = model.item.asOfDate;
          itemData.item.noResponse = false;
          wasChanged = true;
          viewModel.itemsViewModel.changed = true;
        }
        if (model.item.startDate && model.item.endDate && model.item.itemType === ItemType.DATE_RANGE) {
          itemData.item.itemType = model.item.itemType;
          itemData.item.startDate = model.item.startDate;
          itemData.item.endDate = model.item.endDate;
          itemData.item.noResponse = false;
          wasChanged = true;
        }
      }
    });
    if (wasChanged) {
      this.uiStateService.showGreenAlert('Items updated, changes must to be saved', false);
    }
  }
}
