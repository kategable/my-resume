import { ContactViewModel, EnvelopeViewModel, ItemsViewModel } from '../../firm-request/models/envelope-view-model';
import {
  Envelope,
  ExternalUserData,
  InternalUserData,
  RequestData,
  UserGroupData,
} from '../../api/envelope/envelope.api.interface';
import { FirmIndividualType, RequestTargetType as RecipientType } from '../../firm-request/enums/firm-rep-type';
import EnvelopeStatus from '../../firm-request/enums/envelope-status';
import { personMapper } from './person.mapper';
import { ViewModelSource, mapList } from './mappers';
import { Config, Contacts, Staffs } from '../../service/config/config.interface';
import { extrenalUserDataMapper } from './external-user-data.mapper';
import { internalUserDataMapper } from './internal-user-data.mapper';
import { staffsMapper } from './staffs-InternalUserData.mapper';
import { itemsMapper } from './items.mapper';
import { DEFAULT_EMAIL_SUBJECT } from '../constants/envelope.constants';
import { contactViewModelValidationMapper } from './contact-view-model-validation.mapper';
import { itemsViewModelValidationMapper } from './items-view-model-validation.mapper';
import { emailSubjectMapper } from './email-subject.mapper';
import { statusMapper } from './status.mapper';
import { FirmToContactsMappers } from './firm-to-contact.mapper';

// i. For draft:
// 1. If firmId is null it is R2I
// 2. Else if requestAssignees.lstPersonData is not empty, it is R2IAF
// 3. Else if requestAssignees.lstFirmData is not empty, it is R2F
// 4. Else data error
// ii. For published:
// 1. If target is empty/null it is R2I
// then follow draft logic

function getRecipientType(envelope: Envelope): RecipientType {
  const draftPayload = envelope.draftPayload;
  if (!draftPayload) return RecipientType.FIRM; // TODO: refactor to accept UNDEFINED there
  else if ((envelope.isPublished && !draftPayload?.target?.length) || (!envelope.isPublished && !draftPayload.firmId))
    return RecipientType.INDIVIDUAL;
  else if (draftPayload.requestAssignees?.lstPersonData?.length > 0) return RecipientType.INDIVIDUAL_ASSOCIATED;
  else if (draftPayload.requestAssignees?.lstFirmData?.length > 0) return RecipientType.FIRM;
  else throw 'Undetactable recipient type in draftPayload';
}

function toFirmIndividualType(recipientType: RecipientType): FirmIndividualType {
  switch (recipientType) {
    case RecipientType.FIRM:
    case RecipientType.UNDEFINED:
      return FirmIndividualType.FIRM;
    case RecipientType.INDIVIDUAL:
    case RecipientType.INDIVIDUAL_ASSOCIATED:
      return FirmIndividualType.INDIVIDUAL;
  }
}
export const envelopeMapper = (source: ViewModelSource): EnvelopeViewModel => {
  if (!source.envelope || !source.config) return {} as EnvelopeViewModel;
  const envelope: Envelope = source.envelope;
  const config: Config = source.config;
  const isNew = !envelope.envelopeId;
  const requestAssignees = envelope.draftPayload?.requestAssignees;
  const staff = config.staffs;
  let templateId: string = envelope.draftPayload?.templateId || '';
  let emailSubjectPrepend = envelope.draftPayload?.emailSubjectPrepend;
  if (isNew) {
    emailSubjectPrepend = DEFAULT_EMAIL_SUBJECT;
  }
  const recipientType = getRecipientType(source.envelope);
  let selectedContactsForIndividual: Contacts[] = [];
  let selectedContactsForFirm: Contacts[] = [];
  let associatedFirm = null;

  if (recipientType === RecipientType.FIRM) {
    selectedContactsForFirm = mapList(internalUserDataMapper)(userData(envelope) as InternalUserData[]);
  }
  if (recipientType === RecipientType.INDIVIDUAL || recipientType === RecipientType.INDIVIDUAL_ASSOCIATED) {
    selectedContactsForIndividual = mapList(extrenalUserDataMapper)(userData(envelope));
  }
  if (recipientType === RecipientType.INDIVIDUAL_ASSOCIATED) {
    associatedFirm = envelope.isPublished
      ? Config.getFirmContactByName(source.config, source!.envelope!.draftPayload.target!)
      : Config.getFirmContact(source.config, '' + source.envelope.draftPayload.firmId);
  }
  const selectedStaffsSource = staffUserGroupData(envelope);
  let selectedStaffs: Staffs[] = [];
  if (selectedStaffsSource.length > 0) {
    selectedStaffs = mapList(staffsMapper)(selectedStaffsSource);
  }
  const selectedIndividuals = mapList(personMapper)(requestAssignees?.lstPersonData);
  const contactsViewModel: ContactViewModel = {
    caseId: config.businessContext.businessId,
    changed: isNew,
    contactsForFirm: [],
    email: envelope.draftPayload?.email,
    emailSubjectEditable: envelope.draftPayload?.emailSubjectEditable,
    emailSubjectPrepend,
    envelopeId: envelope.envelopeId || '',
    extension: envelope.draftPayload?.extension,
    includeContactInfo: envelope.draftPayload?.includeContactInfo,
    isNew,
    lstAttachments: envelope.draftPayload?.lstAttachments || [],
    notificationMsg: envelope.draftPayload?.notificationMsg,
    externalNotificationMessage: source.selectedTemplate?.messages?.externalNotificationMessage || '',
    externalNonfirmNotificationMessage: source.selectedTemplate?.messages?.externalNonfirmNotificationMessage || '',
    phone: envelope.draftPayload?.phone,
    recipientType: toFirmIndividualType(recipientType),
    selectedContactsForFirm,
    selectedContactsForIndividual,
    selectedFirm:
      recipientType === RecipientType.FIRM
        ? FirmToContactsMappers.firmToContactSafeMapper(requestAssignees?.lstFirmData[0])
        : null, // not [0]. but with firmId!
    selectedIndividuals,
    associatedFirm,
    selectedStaffs,
    selectedTemplate: source.selectedTemplate,
    isValid: false,
  };

  const firms = Config.getFirmContacts(config);
  const individuals = Config.getNonFirmContactsWithEmail(config);

  const primaryFirm: Contacts | undefined = firms && firms.find((firm: Contacts) => firm.primaryFlag);
  if (!contactsViewModel.selectedFirm && primaryFirm && recipientType === RecipientType.FIRM) {
    contactsViewModel.selectedFirm = primaryFirm;
  }
  if (isNew) {
    if (!source.selectedTemplate) {
      throw new Error('Template is not selected');
    }
    contactsViewModel.emailSubjectEditable = emailSubjectMapper(
      source.selectedTemplate,
      contactsViewModel.selectedFirm?.name,
      config.businessContext.businessId
    );
    contactsViewModel.notificationMsg =
      recipientType == RecipientType.FIRM
        ? contactsViewModel.externalNotificationMessage
        : contactsViewModel.externalNonfirmNotificationMessage;
    templateId = source.selectedTemplate.id;
  }
  const items = itemsMapper(staff, envelope.draftPayload?.lstItemData || [], envelope.envelopeId);
  const itemsViewModel: ItemsViewModel = {
    items,
    firmId: contactsViewModel.selectedFirm
      ? contactsViewModel.selectedFirm.crdId
      : contactsViewModel.associatedFirm
      ? contactsViewModel.associatedFirm.crdId
      : '',
    changed: isNew,
    isValid: false,
  };
  itemsViewModel.isValid = itemsViewModelValidationMapper(itemsViewModel);

  const viewModel: EnvelopeViewModel = {
    transferFrom: contactsViewModel.recipientType,
    transferInProgress: false,
    accessPolicyId: '',
    caseId: config.businessContext.businessId,
    contactsViewModel,
    draftPayloadId: envelope.draftPayload?.id,
    draftPayloadVersion: envelope.draftPayload?.version,
    firms,
    individuals,
    itemsViewModel,
    requestManagerId: envelope.requestManagerId || '',
    staff,
    isPublished: envelope.isPublished || false,
    status: statusMapper(envelope.draftPayload?.status),
    templateId,
    showTransferButton: false,
  };
  viewModel.contactsViewModel.isValid = contactViewModelValidationMapper(viewModel);
  viewModel.showTransferButton =
    viewModel.isPublished &&
    viewModel.status !== EnvelopeStatus.ACCEPTED &&
    viewModel.status !== EnvelopeStatus.WITHDRAWN &&
    viewModel.status !== EnvelopeStatus.DRAFT;

  return viewModel;
};

export const userData = (envelope: Envelope): InternalUserData[] | ExternalUserData[] => {
  if (!(envelope.draftPayload?.dataRequestContacts?.lstFirmDataExternal?.length > 0)) return [];

  const lstFirmDataExternal =
    envelope.draftPayload?.dataRequestContacts.lstFirmDataExternal &&
    envelope.draftPayload?.dataRequestContacts.lstFirmDataExternal.length > 0
      ? envelope.draftPayload?.dataRequestContacts.lstFirmDataExternal.find(
          (i) => i.lstUserGroupDataSelected.length > 0
        )
      : null;

  if (lstFirmDataExternal === null || lstFirmDataExternal?.lstUserGroupDataSelected.length === 0) {
    return [];
  }
  const groupData: UserGroupData | null =
    lstFirmDataExternal && lstFirmDataExternal.lstUserGroupDataSelected
      ? lstFirmDataExternal.lstUserGroupDataSelected[0]
      : null;

  return groupData?.lstUserData || [];
};

export const staffUserGroupData = (envelope: Envelope): InternalUserData[] => {
  let list: InternalUserData[] = [];
  if (!envelope.draftPayload?.dataRequestContacts?.firmDataInternal?.lstUserGroupDataSelected) {
    return list;
  }
  if (envelope.draftPayload?.dataRequestContacts.firmDataInternal.lstUserGroupDataSelected.length === 0) {
    return list;
  }
  const groupData: UserGroupData[] =
    envelope.draftPayload.dataRequestContacts.firmDataInternal.lstUserGroupDataSelected;

  return mapList(internalUserData)(groupData) || list;
};
export const internalUserData = (group: UserGroupData): InternalUserData => {
  return {
    ...group.lstUserData[0],
  } as InternalUserData;
};
