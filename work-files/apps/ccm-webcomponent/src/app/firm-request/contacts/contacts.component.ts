import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { debounce } from 'lodash';
import { UiStateService } from '../../service/ui-state.service';
import EnvelopeStatus from '../enums/envelope-status';
import { Contacts, Staffs } from '../../service/config/config.interface';
import { FirmIndividualType } from '../enums/firm-rep-type';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactViewModel, EnvelopeViewModel } from '../models/envelope-view-model';
import { primaryContactForFirmMapper } from '../../common/converters/primary-contact.mapper';
import { emailSubjectMapper } from '../../common/converters/email-subject.mapper';
import { map, tap } from 'rxjs';
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const FINRA_EMAIL_REGEX = /^[a-z0-9]+(?!.*(?:\+{2,}|\-{2,}|\.{2,}))(?:[\.+\-]{0,1}[a-z0-9])*@finra\.org$/;
export const NUMBERS_ONLY = /^[0-9]{10}$/;
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ContactsComponent implements OnInit {
  showTransferConfirmation = false;
  search: any; // TODO: check unused

  public get firmIndividualType(): typeof FirmIndividualType {
    return FirmIndividualType;
  }
  searchTerm: string = '';
  selectedResultText: string = '';
  searchResults: any = [];
  viewModel$ = this.uiStateService.envelopeViewModel$.pipe(
    map((viewModel) => {
      if (viewModel === null) return null;
      this.setUpForm(viewModel);
      viewModel.contactsViewModel.selectedContactsForFirm = primaryContactForFirmMapper(
        viewModel,
        viewModel.contactsViewModel.contactsForFirm || []
      );
      return viewModel;
    })
  );
  canChangeType: boolean = false;

  FirmControl = new FormControl<Contacts | null>(null);
  AssociatedFirmControl = new FormControl<Contacts | null>(null);
  FirmCCControl = new FormControl<Contacts | null>(null);
  IndividualControl = new FormControl();
  IndividualCCControl = new FormControl();
  InternalContactControl = new FormControl();
  IncludeContactInfoControl = new FormControl();
  PhoneNumberControl = new FormControl();
  ExtensionControl = new FormControl();
  EmailControl = new FormControl();
  EmailSubjectEditableControl = new FormControl();
  NotificationMsgControl = new FormControl();

  showAddNewContactDialog = false;
  showAdditionalContactDialog = false;
  loadingIndicator$ = this.uiStateService.loadingIndicator$;
  //RTE props
  editorStyle = {
    height: '300px',
    width: '100%',
    backgroundColor: '#fff',
  };
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
      ['link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: ['right', 'center', 'justify'] }],
    ],
  };
  envelopeForm: FormGroup = new FormGroup({});

  emptyFirm: Contacts;

  constructor(private readonly uiStateService: UiStateService, private readonly formBuilder: FormBuilder) {
    this.search = debounce(this.searchFn, 1000);
    this.emptyFirm = new Contacts();
    this.emptyFirm.name = 'No firm is associated';
    this.emptyFirm.crdId = '-2';
  }
  ngOnInit(): void {}

  setUpForm(viewModel: EnvelopeViewModel) {
    const phone_validators = !viewModel.isPublished
      ? [Validators.minLength(10), Validators.pattern(NUMBERS_ONLY)]
      : null;
    const required_validator = !viewModel.isPublished || viewModel.transferInProgress ? Validators.required : null;
    const email_validator =
      !viewModel.isPublished || viewModel.transferInProgress ? Validators.pattern(EMAIL_REGEX) : null;

    this.FirmControl = new FormControl<Contacts | null>(
      { value: viewModel.contactsViewModel.selectedFirm, disabled: false },
      required_validator
    );
    this.AssociatedFirmControl = new FormControl<Contacts | null>({
      value: viewModel.contactsViewModel.selectedFirm,
      disabled: viewModel.isPublished,
    });

    this.FirmCCControl = new FormControl<Contacts | null>({ value: null, disabled: false });
    this.InternalContactControl = new FormControl<Staffs | null>({
      value: null,
      disabled: viewModel.isPublished && viewModel.transferInProgress,
    });
    this.IncludeContactInfoControl = new FormControl<boolean>({
      value: viewModel.contactsViewModel.includeContactInfo,
      disabled: viewModel.isPublished,
    });

    this.PhoneNumberControl = new FormControl<string>(
      {
        value: viewModel.contactsViewModel.phone,
        disabled: viewModel.isPublished || !viewModel.contactsViewModel.includeContactInfo,
      },
      phone_validators
    );
    this.ExtensionControl = new FormControl<string>({
      value: viewModel.contactsViewModel.extension,
      disabled: viewModel.isPublished || !viewModel.contactsViewModel.includeContactInfo,
    });
    this.EmailControl = new FormControl<string>(
      {
        value: viewModel.contactsViewModel.email,
        disabled: viewModel.isPublished || !viewModel.contactsViewModel.includeContactInfo,
      },
      email_validator
    );
    this.IndividualControl = new FormControl<Contacts | null>({
      value: null,
      disabled: false,
    });
    this.IndividualCCControl = new FormControl<Contacts | null>({
      value: null,
      disabled: viewModel.isPublished && !viewModel.transferInProgress,
    });
    this.EmailSubjectEditableControl = new FormControl<string | null>(
      { value: viewModel.contactsViewModel.emailSubjectEditable, disabled: viewModel.isPublished },
      required_validator
    );

    this.NotificationMsgControl = new FormControl<string | null>(
      { value: viewModel.contactsViewModel.notificationMsg, disabled: viewModel.isPublished },
      required_validator
    );

    if (!viewModel.isPublished) {
      this.envelopeForm = this.formBuilder.group({
        FirmControl: this.FirmControl,
        IndividualControl: this.IndividualControl,
        IndividualCCControl: this.IndividualCCControl,
        FirmCCControl: this.FirmCCControl,
        InternalContactControl: this.InternalContactControl,
        IncludeContactInfoControl: this.IncludeContactInfoControl,
        PhoneNumberControl: this.PhoneNumberControl,
        ExtensionControl: this.ExtensionControl,
        EmailControl: this.EmailControl,
        EmailSubjectEditableControl: this.EmailSubjectEditableControl,
      });
      if (viewModel.isPublished && !viewModel.transferInProgress) {
        if (viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM) {
          this.envelopeForm = this.formBuilder.group({
            FirmCCControl: this.FirmCCControl,
            InternalContactControl: this.InternalContactControl,
          });
        } else {
          this.envelopeForm = this.formBuilder.group({
            IndividualCCControl: this.IndividualCCControl,
            InternalContactControl: this.InternalContactControl,
          });
        }
      }
      if (viewModel.isPublished && viewModel.transferInProgress) {
        if (viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM) {
          this.envelopeForm = this.formBuilder.group({
            FirmControl: this.FirmControl,
            FirmCCControl: this.FirmCCControl,
          });
        } else {
          this.envelopeForm = this.formBuilder.group({
            IndividualControl: this.IndividualControl,
            IndividualCCControl: this.IndividualCCControl,
            InternalContactControl: this.InternalContactControl,
          });
        }
      }
    }
  }
  async searchFn($event: any) {
    if ($event?.detail?.event?.keyCode === 13) {
      return;
    }
    if (!$event || !$event.detail) {
      return;
    }

    this.searchTerm = $event.detail.value || '';
    this.searchResults = await this.uiStateService.fetchInternalContacts(this.searchTerm);
  }

  onRecipientTypeChange($event: any, envelopeView: EnvelopeViewModel) {
    const recipientType = $event.target.value as FirmIndividualType;
    const viewModel = envelopeView.contactsViewModel;
    if (recipientType === viewModel.recipientType) {
      return;
    }

    viewModel.selectedFirm = null;
    viewModel.recipientType = recipientType;
    viewModel.changed = true;
    if (!envelopeView.transferInProgress) {
      viewModel.selectedStaffs = [];
    }
    viewModel.selectedContactsForFirm = [];
    viewModel.selectedContactsForIndividual = [];
    viewModel.selectedIndividuals = [];
    viewModel.emailSubjectEditable = emailSubjectMapper(viewModel.selectedTemplate, '', viewModel.caseId);
    viewModel.notificationMsg =
      viewModel.recipientType == FirmIndividualType.FIRM
        ? viewModel.externalNotificationMessage
        : viewModel.externalNonfirmNotificationMessage;

    this.setUpForm(envelopeView);
    this.EmailSubjectEditableControl.markAsDirty();
  }

  confirmTransfer() {
    this.showTransferConfirmation = true;
  }

  setAssociatedFirmSelection(viewModel: EnvelopeViewModel) {
    if (viewModel.contactsViewModel.associatedFirm) viewModel.firms = [viewModel.contactsViewModel.associatedFirm];
  }
  // https://wiki.finra.org/display/RM/RM+Form+API+-+PATCH#RMFormAPIPATCH-PATCHREQUESTASSIGNEES(TRANSFERREQUEST)
  //
  // Transfer options:
  // 1. Individual - only for another unassociated individual
  //     show:
  //        - recipient(To:)  dropdown. fill with individuals from a case
  //     hide:
  //        - individual/firm radio
  //        - associated firm  dropdown
  // 2. Associated Individual
  //    - to associated individual, same firm
  //    - to associated firm
  //    show:
  //     - individual/firm radio
  //     - recipient(To:)  dropdown
  //       - when firm radio is selected, pre-fill it with associated firm,  associated firm shoould be pre-filled with the
  //       - when individual radio is selected, pre-fill it with (all individuals from a case, or subset of??)
  //     associated selection is read-only.
  // 3. Firm
  //    - to associated individual of the same firm
  //    show:
  //      - individual/firm radio is :
  //   ..TBD..

  transfer(viewModel: EnvelopeViewModel) {
    this.showTransferConfirmation = false;
    viewModel.transferInProgress = true;
    viewModel.contactsViewModel.changed = true;

    viewModel.contactsViewModel.selectedFirm = null;

    viewModel.contactsViewModel.selectedContactsForFirm = [];
    viewModel.contactsViewModel.selectedContactsForIndividual = [];
    viewModel.contactsViewModel.selectedIndividuals = [];
    this.canChangeType = true;
    if (viewModel.contactsViewModel.recipientType === FirmIndividualType.FIRM) {
      this.canChangeType = false;
    } else {
      this.canChangeType = true;
    }
    viewModel.contactsViewModel.recipientType = FirmIndividualType.INDIVIDUAL;

    this.setUpForm(viewModel);
    this.IndividualControl.markAsDirty();
    this.IndividualCCControl.markAsDirty();
    this.setAssociatedFirmSelection(viewModel);
    this.FirmControl.markAsDirty();
    this.FirmCCControl.markAsDirty();
  }

  async onIndividualChange(event: any, viewModel: ContactViewModel) {
    const selectedContact: Contacts = event.detail.value;
    if (!selectedContact) return;
    const duplicate = viewModel.selectedIndividuals.find((c: Contacts) => {
      return selectedContact.businessEmail[0] === c.businessEmail[0];
    });
    if (duplicate) {
      return;
    }
    viewModel.selectedIndividuals.push(selectedContact);
    this.IndividualControl.markAsDirty();
    viewModel.changed = true;
  }

  async onSelectedIndividualCCChange(event: any, viewModel: ContactViewModel) {
    const selectedContact: Contacts = event.detail.value;
    if (!selectedContact) return;
    if (!selectedContact.businessEmail?.length) {
      const intContactInfo: any = await this.uiStateService.fetchInternalContactsByName(selectedContact.name);
      if (intContactInfo && intContactInfo.length > 0) {
        selectedContact.businessEmail = [intContactInfo[0].fields.ac_finra_users_email_address];
      }
    }
    const duplicate = viewModel.selectedContactsForIndividual.find(
      (c: Contacts) => selectedContact.businessEmail[0] === c.businessEmail[0]
    );
    if (duplicate) {
      return;
    }
    viewModel.selectedContactsForIndividual.push(selectedContact);
    this.IndividualCCControl.markAsDirty();
    viewModel.changed = true;
  }
  removeExtContactsForIndividual(index: number, viewModel: ContactViewModel) {
    viewModel.selectedContactsForIndividual.splice(index, 1);
    this.IndividualCCControl.markAsDirty();
    viewModel.changed = true;
  }

  removeSelectedIndividuals(index: number, viewModel: ContactViewModel) {
    viewModel.selectedIndividuals.splice(index, 1);
    this.IndividualControl.markAsDirty();
  }

  onRemoveExternalContactsForFirm(index: number, viewModel: ContactViewModel) {
    viewModel.selectedContactsForFirm.splice(index, 1);
    this.FirmCCControl.markAsDirty();
    viewModel.changed = true;
  }

  async onInternalContactSelect(event: any, viewModel: ContactViewModel) {
    const selected: Staffs = event.detail.value;
    if (!selected) return;

    if (!selected.email?.length) {
      const intContactInfo: Staffs[] = await this.uiStateService.fetchInternalContactsByName(selected.userId);
      if (intContactInfo && intContactInfo.length > 0) {
        selected.email = intContactInfo[0].email;
      }
    }
    const duplicate = viewModel.selectedStaffs.find((c: Staffs) => selected.email === c.email);
    if (duplicate) {
      return;
    }
    viewModel.selectedStaffs.push(selected);
    this.InternalContactControl.markAsDirty();
    viewModel.changed = true;
  }

  onRemoveInternalContact(index: number, viewModel: ContactViewModel) {
    viewModel.selectedStaffs.splice(index, 1);
    this.InternalContactControl.markAsDirty();
    viewModel.changed = true;
  }
  onAdditionalRecipient(contact: Contacts, viewModel: ContactViewModel) {
    this.showAddNewContactDialog = false;
    if (viewModel.recipientType === FirmIndividualType.FIRM) {
      if (!viewModel.selectedContactsForFirm.find((c) => c.businessEmail[0] === contact.businessEmail[0])) {
        viewModel.selectedContactsForFirm.push(contact);
        viewModel.changed = true;
      }
      return;
    }
    if (!viewModel.selectedContactsForIndividual.find((c) => c.businessEmail[0] === contact.businessEmail[0])) {
      viewModel.selectedContactsForIndividual.push(contact);
      viewModel.changed = true;
    }
  }
  onAddAdditionalContacts(staffs: Staffs[], viewModel: ContactViewModel) {
    this.showAdditionalContactDialog = false;
    staffs.forEach((staff) => {
      if (!viewModel.selectedStaffs.find((s) => s.email === staff.email)) {
        viewModel.selectedStaffs.push(staff);
      }
    });
    viewModel.changed = true;
  }

  onDraftChange($event: any, control: FormControl, viewModel: ContactViewModel) {
    control.setValue($event.target.value);
    control.markAsTouched();
    viewModel.changed = true;
    switch (control) {
      case this.IncludeContactInfoControl:
        viewModel.includeContactInfo = this.IncludeContactInfoControl.value || undefined;
        if (viewModel.includeContactInfo) {
          this.EmailControl.addValidators(Validators.required);
          this.EmailControl.markAsTouched();
          this.EmailControl.enable();
          this.PhoneNumberControl.enable();
          this.ExtensionControl.enable();
        } else {
          this.EmailControl.removeValidators(Validators.required);
          this.EmailControl.disable();
          this.PhoneNumberControl.disable();
          this.ExtensionControl.disable();
        }
        this.EmailControl.updateValueAndValidity();

        break;
      case this.PhoneNumberControl:
        viewModel.phone = this.PhoneNumberControl.value || undefined;
        break;
      case this.ExtensionControl:
        viewModel.extension = this.ExtensionControl.value || undefined;
        break;
      case this.EmailControl:
        viewModel.email = this.EmailControl.value || undefined;
        break;
      case this.EmailSubjectEditableControl:
        viewModel.emailSubjectEditable = this.EmailSubjectEditableControl.value || undefined;
        break;
      case this.NotificationMsgControl:
        viewModel.notificationMsg = this.NotificationMsgControl.value || undefined;
        break;
      default:
    }
    viewModel.changed = true;
  }

  editorChange($event: any, viewModel: ContactViewModel) {
    this.NotificationMsgControl.setValue($event.detail);
    viewModel.notificationMsg = $event.detail;
    // finra-rich-text-editor emits this event not only on text change,
    // bit also on click inside the RTE. I did not find a way to distinct
    // the click events from useful. Therefore, we mark doc as ditry on every click
    viewModel.changed = true;
  }

  onAssociatedFirmChange(event: any, envelopeView: EnvelopeViewModel) {
    let viewModel = envelopeView.contactsViewModel;
    const associatedFirm = event.detail.value as Contacts;
    if (!associatedFirm) return;
    if (associatedFirm.crdId == viewModel.selectedFirm?.crdId) return;
    if (associatedFirm.crdId == '-2') {
      // no associated firm
      viewModel.recipientType = FirmIndividualType.INDIVIDUAL;
      viewModel.associatedFirm = null;
    } else {
      viewModel.recipientType = FirmIndividualType.INDIVIDUAL;
      viewModel.associatedFirm = associatedFirm;
    }
    this.uiStateService.associateFirm(associatedFirm);
    this.AssociatedFirmControl.markAsDirty();

    viewModel.changed = true;
    // TODO: adjust email subject and body
  }

  onFirmsChange(event: any, envelopeView: EnvelopeViewModel) {
    let viewModel = envelopeView.contactsViewModel;
    const selectedFirm = event.detail.value as Contacts;
    if (!selectedFirm) return;
    if (selectedFirm.crdId == viewModel.selectedFirm?.crdId) return;
    viewModel.selectedFirm = selectedFirm;
    viewModel.selectedContactsForFirm = [];
    this.uiStateService.selectFirm(selectedFirm);
    this.FirmControl.markAsDirty();
    this.FirmControl.setValue(selectedFirm);
    viewModel.changed = true;
    viewModel.emailSubjectEditable = emailSubjectMapper(
      viewModel.selectedTemplate,
      selectedFirm.name,
      viewModel.caseId
    );
  }
  async onSelectedFirmsCCChange(event: any, viewModel: ContactViewModel) {
    const selectedContact: Contacts = event.detail.value;
    if (!selectedContact) return;
    if (!selectedContact.businessEmail?.length) {
      const intContactInfo: any = await this.uiStateService.fetchInternalContactsByName(selectedContact.name);
      if (intContactInfo && intContactInfo.length > 0) {
        selectedContact.businessEmail = [intContactInfo[0].fields.ac_finra_users_email_address];
      }
    }

    const duplicate = viewModel.selectedContactsForFirm.find(
      (c: any) => selectedContact.businessEmail[0] === c.businessEmail[0]
    );
    if (duplicate) {
      return;
    }
    viewModel.selectedContactsForFirm.push(selectedContact);
    this.FirmCCControl.markAsDirty();
    viewModel.changed = true;
  }
  markInvalid() {
    setTimeout(() => {
      this.envelopeForm.markAllAsTouched();
      this.envelopeForm.markAsDirty();
    }, 100);
  }
}
