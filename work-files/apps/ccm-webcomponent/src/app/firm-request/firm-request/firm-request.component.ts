import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { UiStateService } from '../../service/ui-state.service';
import { Config, Contacts, Tag } from '../../service/config/config.interface';
import { EnvelopeViewModel } from '../models/envelope-view-model';
import { filter } from 'rxjs';
import { RequestModel } from '../models/request.model';

@Component({
  selector: 'app-firm-request',
  templateUrl: './firm-request.component.html',
  styleUrls: ['./firm-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class FirmRequestComponent {
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef!: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef!: TemplateRef<any>;

  @Input() tags: Tag[] = [];
  @Input() contacts: Contacts[] = [];
  @Input() externalContacts: Contacts[] = [];
  @Input() internalContacts?: Contacts[] = [];
  @Input() schema: Config | null = null;

  viewModel$ = this.uiStateService.envelopeViewModel$.pipe(filter((view) => !!view));
  @Output() onClose = new EventEmitter();

  config: Config = new Config();
  errorMsg: string = '';
  showSuccess: boolean = false;
  changesSaved: boolean = true;
  showError: boolean = false;
  showDeleteConfirmDialog: boolean = false;
  showPublishConfirmDialog: boolean = false;
  showBackConfirmation: boolean = false;
  publishInProgress: boolean = false;
  toastMessage: string = '';
  requestTypes: any = [];
  requests: any = [];

  constructor(private uiStateService: UiStateService) {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.changesSaved) {
      $event.returnValue = true;
    }
  }

  async onPublish(viewModel: EnvelopeViewModel) {
    this.publishInProgress = true;
    await this.publishContent(viewModel);
  }

  private async publishContent(viewModel: EnvelopeViewModel) {
    if (!viewModel) {
      throw new Error('view model must be defined');
    }
    const result = await this.uiStateService.publish(viewModel);
    if (result.good) {
      this.toggleConfirmPublishSuccess();
    } else {
      this.uiStateService.showRedAlert(result.message, true);
    }
  }

  toggleConfirmPublishSuccess() {
    this.showPublishConfirmDialog = !this.showPublishConfirmDialog;
  }

  onConfirmPublishSuccess() {
    this.toggleConfirmPublishSuccess();
    this.uiStateService.start();
  }

  toggleDeleteConfrimDialog() {
    this.showDeleteConfirmDialog = !this.showDeleteConfirmDialog;
  }

  onDeleteDraft() {
    this.toggleDeleteConfrimDialog();
  }

  async onConfirmDeleteDraft(viewModel: EnvelopeViewModel) {
    this.toggleDeleteConfrimDialog();
    if (!viewModel) {
      throw new Error('view model must be defined');
    }
    const result: RequestModel | null = await this.uiStateService.deleteDraft(viewModel);
    if (result === null) return;
    if (result.good) {
      this.uiStateService.showGreenAlert(result.message);
    } else {
      this.uiStateService.showRedAlert(result.message, true);
    }
  }

  toggleShowSuccess(msg: string = '') {
    this.toastMessage = msg;
    this.showSuccess = !this.showSuccess;
    if (this.showSuccess) {
      this.uiStateService.showGreenAlert(msg);
    }
  }

  toggleShowError(errorMsg?: string) {
    this.showError = !this.showError;
    this.errorMsg = errorMsg || 'An error occurred while performing the required operation.';
    if (this.showError) {
      this.uiStateService.showRedAlert(errorMsg || 'error happend');
    }
  }

  onChange() {
    this.changesSaved = false;
  }

  onBack(viewModel: EnvelopeViewModel) {
    if (viewModel.contactsViewModel.changed || viewModel.itemsViewModel.changed) {
      this.showBackConfirmation = true;
      return;
    }
    this.onConfirmBack();
  }

  onCancelBack() {
    this.showBackConfirmation = false;
  }

  onConfirmBack() {
    this.showBackConfirmation = false;
    this.uiStateService.start();
  }
}
