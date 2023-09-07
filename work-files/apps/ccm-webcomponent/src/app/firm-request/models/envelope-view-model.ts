import { FirmIndividualType } from '../enums/firm-rep-type';
import EnvelopeStatus from '../enums/envelope-status';
import { Contacts, Staffs } from '../../service/config/config.interface';
import { AttachmentData, RequestTemplate, ItemData } from '../../api/envelope/envelope.api.interface';

export interface EnvelopeViewModel {
  transferInProgress: boolean;
  transferFrom: FirmIndividualType | null;
  draftPayloadVersion: number | null | undefined;
  draftPayloadId: string | null | undefined;
  caseId: string;
  templateId: string;
  accessPolicyId: string;
  contactsViewModel: ContactViewModel;
  firms: Contacts[];
  individuals: Contacts[];
  staff: Staffs[];
  itemsViewModel: ItemsViewModel;
  status: EnvelopeStatus;
  requestManagerId: string;
  isPublished: boolean;
  showTransferButton: boolean;
}

export interface ContactViewModel {
  caseId: any;
  changed: boolean;
  contactsForFirm: Contacts[];
  email: string;
  emailSubjectEditable: string;
  emailSubjectPrepend: any;
  envelopeId: string;
  extension: string;
  includeContactInfo: boolean;
  isNew: boolean;
  lstAttachments: AttachmentData[];
  notificationMsg: string;
  externalNotificationMessage: string; // read-only source for notificationMsg
  externalNonfirmNotificationMessage: string; // read-only source for notificationMsg
  phone: string;
  recipientType: FirmIndividualType;
  selectedContactsForFirm: Contacts[];
  selectedContactsForIndividual: Contacts[];
  selectedFirm: Contacts | null;
  selectedIndividuals: Contacts[];
  associatedFirm: Contacts | null | undefined;
  selectedStaffs: Staffs[];
  selectedTemplate: RequestTemplate | null | undefined;
  isValid: boolean;
}

export interface ItemsViewModel {
  changed: boolean;
  items: ItemDataViewModel[];
  firmId: string;
  isValid: boolean;
}

export interface ItemDataViewModel {
  partiallySubmitted?: boolean;
  icon: string;
  version: number | null | undefined;
  envelopeId: string;
  catFlag: boolean;
  d2iFlag: boolean;
  hasClearingFirm: boolean;
  item: ItemData;
  noResponseFlagAvailable: boolean;
  open: boolean;
  rciFlag?: boolean;
  selectedAssignTo: Staffs | null;
  selectedClearingFirm: Contacts | null;
  hasBeenSaved: boolean;
  selected: boolean;
}
export interface ItemEventViewModel {
  identityProvider: string;
  dueDate: null | string;
  fullName: string;
  isExternalUser: boolean;
  userName: string;
  targetId: number;
  action: string;
  formattedComments: string;
  documents: DocumentModel[];
  createDate: string;
}
export interface DocumentModel {
  filename: string;
  fileSize: number;
  attachmentUrl: string;
}
