import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmRequestComponent } from './firm-request/firm-request.component';
import { RequestTypeComponent } from './request-type/request-type.component';
import { RequestWizardComponent } from './request-wizard/request-wizard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemsInRequestComponent } from './items-in-request/items-in-request.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HttpClientModule } from '@angular/common/http';
import { AdditionalContactDialogComponent } from './contacts/additional-contact-dialog/additional-contact-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { AttachmentsComponent } from './attachments/attachments.component';
import { ItemActionsUpdateComponent } from './item-actions-update/item-actions-update.component';
import { TogglePanelComponent } from './items-in-request/toggle-panel/toggle-panel.component';
import { ViewitemComponent } from './items-in-request/view-item/view-item.component';
import { ItemActionsActivitiesComponent } from './item-actions-update/item-actions-activities/item-actions-activities.component';
import { FilesizePipe } from '../common/pipes/filesize.pipe';
import { AdditionalRecipientDialogComponent } from './contacts/additional-recipient-dialog/additional-recipient-dialog.component';
import { StaffFormatPipe } from '../common/pipes/staff-format.pipe';
import { ContactFormatPipe } from '../common/pipes/contact-format.pipe';
import { EmailOfContactPipe } from '../common/pipes/email-of-contact.pipe';
import { FirmNamePipe } from '../common/pipes/firm-name.pipe';
import { EmailOfStaffPipe } from '../common/pipes/email-of-staff.pipe';
import { UploadedAttachmentsComponent } from './uploaded-attachments/uploaded-attachments.component';
import { ItemsBulkUpdateComponent } from './items-bulk-update/items-bulk-update.component';
import { TransferConfirmationComponent } from './firm-request/transfer-confirmation/transfer-confirmation.component';
import { SentAttachmentPipe } from '../common/pipes/sent-attachment.pipe';
import { ReceivedDocumentsPipe } from '../common/pipes/received-documents.pipe';

@NgModule({
  declarations: [
    FirmRequestComponent,
    RequestTypeComponent,
    RequestWizardComponent,
    ItemsInRequestComponent,
    ContactsComponent,
    AdditionalContactDialogComponent,
    AttachmentsComponent,
    ItemActionsUpdateComponent,
    TogglePanelComponent,
    ViewitemComponent,
    ItemActionsActivitiesComponent,
    FilesizePipe,
    AdditionalRecipientDialogComponent,
    ContactFormatPipe,
    StaffFormatPipe,
    EmailOfContactPipe,
    AlertComponent,
    FirmNamePipe,
    EmailOfStaffPipe,
    UploadedAttachmentsComponent,
    ItemsBulkUpdateComponent,
    TransferConfirmationComponent,
    SentAttachmentPipe,
    ReceivedDocumentsPipe,
  ],
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  exports: [FirmRequestComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FirmRequestModule {}
