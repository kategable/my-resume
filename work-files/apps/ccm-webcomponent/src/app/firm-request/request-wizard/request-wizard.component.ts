import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import Steps from '../enums/Steps';
import { UiStateService } from '../../service/ui-state.service';
import { EnvelopeViewModel } from '../models/envelope-view-model';
import { RequestTargetType } from '../enums/firm-rep-type';
import { contactViewModelValidationMapper } from '../../common/converters/contact-view-model-validation.mapper';
import { itemsViewModelValidationMapper } from '../../common/converters/items-view-model-validation.mapper';
import { ContactsComponent } from '../contacts/contacts.component';
import { ItemsInRequestComponent } from '../items-in-request/items-in-request.component';
import { firstValueFrom } from 'rxjs';
import { ViewModelToEnvelopeMapper } from '../../common/converters/view-model-to-envelope.mapper';

@Component({
  selector: 'app-request-wizard',
  templateUrl: './request-wizard.component.html',
  styleUrls: ['./request-wizard.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class RequestWizardComponent {
  defaultSteps = [
    {
      id: Steps.SELECT_ITEMS,
      name: 'Select Items',
      isActive: true,
      isComplete: false,
    },
    {
      id: Steps.SELECT_CONTACTS,
      name: 'Select Contacts',
      isActive: true,
      isComplete: false,
    },
    {
      id: Steps.PREVIEW_PUBLISH,
      name: 'Preview Publish',
      isActive: true,
      isComplete: false,
    },
  ];

  //By default it starts with first step
  activeStep: string = Steps.SELECT_CONTACTS;

  @Input() requestTypes: any = [];
  @Input() requests: any = [];
  @Input() viewModel?: EnvelopeViewModel | null;
  @Output() onDeleteDraft = new EventEmitter<EnvelopeViewModel>();
  @Output() onChange = new EventEmitter();
  @Output() onPublish = new EventEmitter();
  @ViewChild('appItemsInRequest')
  appItemsInRequest!: ItemsInRequestComponent;

  @ViewChild('appContacts')
  appContacts!: ContactsComponent;

  constructor(private readonly uiStateService: UiStateService) {}

  async saveDraft() {
    if (!this.viewModel) {
      throw new Error('view model must be defined');
    }
    const requestTargetType = ViewModelToEnvelopeMapper.getRequestTargetType(this.viewModel.contactsViewModel);
    if (requestTargetType === RequestTargetType.FIRM && !this.viewModel.contactsViewModel.selectedFirm) {
      this.uiStateService.showRedAlert('need a firm', true);
      this.appContacts.markInvalid();
      return;
    }
    if (
      (requestTargetType === RequestTargetType.INDIVIDUAL ||
        requestTargetType === RequestTargetType.INDIVIDUAL_ASSOCIATED) &&
      !this.viewModel.contactsViewModel.selectedIndividuals?.length
    ) {
      this.uiStateService.showRedAlert('need a contact', true);
      this.appContacts.markInvalid();
      return;
    }
    if (this.viewModel.itemsViewModel.items.length > 0) {
      const noNameForAdHocItem = this.viewModel.itemsViewModel.items.some((i) => i.item.adhocItem && !i.item.itemName);
      if (noNameForAdHocItem) {
        this.uiStateService.showRedAlert('need Ad Hoc item name', true);
        this.appItemsInRequest.markInvalid(this.viewModel);
        return;
      }
      const haveAdhocItemCategory = this.viewModel.itemsViewModel.items.every(
        (i) => !i.item.adhocItem || !!i.item.adhocItemCategory
      );
      if (!haveAdhocItemCategory) {
        this.uiStateService.showRedAlert('need Ad Hoc item category', true);
        this.appItemsInRequest.markInvalid(this.viewModel);
        return;
      }
    }
    await this.uiStateService.saveDraft(this.viewModel).then((value) => {
      if (value.status) {
        this.uiStateService.showGreenAlert(value.message, true);
      }
      if (!value.status) {
        this.uiStateService.showRedAlert(value.message, true);
      }
    });
  }

  deleteDraft() {
    this.onDeleteDraft.emit();
  }

  publish() {
    if (!this.viewModel) {
      throw new Error('view model must be defined');
    }
    if (this.isReadyToPublish(this.viewModel)) {
      this.onPublish.emit();
    }
  }
  async publishChanges() {
    if (!this.viewModel) {
      throw new Error('view model must be defined');
    }
    if (this.isReadyToPublish(this.viewModel)) {
      if (!this.viewModel.transferInProgress) {
        const result = await this.uiStateService.publishChanges(this.viewModel);
        if (result.good) {
          this.uiStateService.showGreenAlert(result.message, true);
        } else {
          this.uiStateService.showRedAlert(result.message, true);
        }
      }
    }
  }
  async transfer() {
    if (!this.viewModel) {
      throw new Error('view model must be defined');
    }
    if (this.isReadyToPublish(this.viewModel)) {
      if (this.viewModel.transferInProgress) {
        const result = await firstValueFrom(this.uiStateService.transfer(this.viewModel));
        if (result.good) {
          this.uiStateService.showGreenAlert(result.message, true, this.uiStateService.start, this.uiStateService);
        } else {
          this.uiStateService.showRedAlert(result.message, true);
        }
      }
    }
  }
  isReadyToPublish(view: EnvelopeViewModel) {
    if (view.isPublished && !view.transferInProgress) {
      return view.contactsViewModel.changed;
    }
    let isValid = contactViewModelValidationMapper(view);
    isValid = isValid && itemsViewModelValidationMapper(view.itemsViewModel);
    return isValid;
  }
}
