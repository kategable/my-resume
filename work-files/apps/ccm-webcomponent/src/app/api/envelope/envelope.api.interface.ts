import { ItemEvent } from '../../firm-request/item-actions-update/item-actions-activities/item-activity.model';
import { Attributes } from '../../firm-request/models/item-template';
import { BusinessObjects } from '../../service/config/config.interface';

export interface Envelope {
  businessObjects: BusinessObjects[];
  businessId: string;
  envelopeId?: string;
  accessPolicyId: string;
  clientId?: string;
  tags: string[];
  deliveryChannelCode: 'RM';
  requestManagerId?: string;
  draftPayload: RequestData;
  isPublished?: boolean;
}

// RM defines 3 types of requests/scenarios. https://wiki.finra.org/display/RM/RM+Draft+Request+-+POST
// No explicit flag/enum to distinct. RM Wiki descrives the how to distinct berween the 3
//
// *** I. R2F - Request to Firm
// 1. firm will be passed in lstFirmData
// 2. Request can be published to only one firm.
// 3. Multiple firm publish is not supported.
// 4. firm Id in the request is used as metadata only
// 5. firm id in the request and firm id in lstFirmData must be same.
//
// *** II. R2IAF - Request to Individual, who is Accociated to Firm
// 1. nonfirm users will be passed in lstPersonData
// 2. Publish to multiple users is supported. Such external users need to self-register to be able to view the requests.
// 3. firm Id in the request is used as metadata only
// 4. Publish to firm users is not allowed. Such users will have a valid firmId and orgClass=FIRM
// 5. Request assignees need to added as a part of lstFirmDataExternal in dataRequestContacts in order to get notifications.
//   a. name must be "firstname lastname" and should match the request assignee name
//   b. group should be null
//   c. email should match the request assignee email.
//   d. firm Id should be -2
// 6. No required firm contact roles will be notified by default. Users have to specifically mentioned.
// 7. Such requests will not be shredded and hence will not be visible in FirmGateway IR cabinet.
//
// *** III. R2I - Request to Individual without any firm association
// 1. firmId is null
// 2. nonfirm users will be passed in lstPersonData
// 3. Publish to multiple users is supported. Such external users need to self-register to be able to view the requests.
// 4. Publish to firm users is not allowed. Such users will have a valid firmId and orgClass=FIRM.
// 5. Request assignees need to added as a part of lstFirmDataExternal in dataRequestContacts in order to get notifications.
//   a. name must be "firstname lastname" and should match the request assignee name
//   b. group should be null
//   c. email should match the request assignee email.
//   d. firm Id should be -2
// 7. No required firm contact roles will be notified by default.
// 8. Such requests will not be shredded and hence will not be visible in FirmGateway IR cabinet.
//
// Based on the above, algorithm to distinct the scenarios from RM JSON is:
// 1. If firmId is null it is R2I
// 2. Else if requestAssignees.lstPersonData is not empty, it is R2IAF
// 3. Else if requestAssignees.lstFirmData is not empty, it is R2F
// 4. Else data error

export interface RequestData {
  status: string | undefined;
  id?: string | null;
  version?: number | null;
  caseId: string;
  firmId: number | string;
  target?: string; // only for published non-orphan-ind
  templateId: string;
  emailSubjectPrepend: string;
  emailSubjectEditable: string;
  notificationMsg: string;
  includeContactInfo: boolean;
  phone: string;
  extension: string;
  email: string;
  requestAssignees: RequestAssigneeData;
  lstAttachments: AttachmentData[];
  lstItemData: ItemData[];
  dataRequestContacts: RequestContactsData;
}

export interface RequestAssigneeData {
  requestId?: number;
  lstPersonData: PersonDto[];
  lstFirmData: Firm[];
}

export interface AttachmentData {
  attachmentId: number | string;
  filename: string;
  contentType: string;
  uploadDate: string; // "06/08/2023 10:01:52 -0400"
  fileSize: number;
  tags?: TagsData;
  readOnly?: boolean;
  uuid?: string;
  externalAttachmentUrl: string; // For URL-style attachment.
  source?: DocumentSource;
  //TODO: The following 3 fields are not used anywhere. But we do get the values from the /save /publish calls from UI.
  // Test to see if these fields can be removed.
  uploadStatus?: 'Available' | 'Processing';
  businessDataKey?: BusinessObjectDataKeyDto;
  attachmentUrl?: string; // The download URL for attachment.
  loaded?: number;
  total?: number;
}

export enum DocumentSource {
  SENT = 'sent',
  RECEIVED = 'received',
}

export enum ItemGroup {
  DOCUMENT = 'DOCUMENT',
  FORM = 'FORM',
  QUESTION = 'QUESTION',
  P_AND_S_BLOTTER = 'P_AND_S_BLOTTER',
  ORDER_BLOTTER = 'ORDER_BLOTTER',
}

export interface ItemData {
  ewsCommentCount?: number;
  partiallySubmitted?: boolean;
  adhocItem: boolean;
  adhocItemCategory?: string; // needed only if adhocItem is true
  asOfDate?: string | null;
  attachments: AttachmentData[];
  attributes?: Attributes;
  dueDate: string | null;
  endDate?: string | null;
  entityId?: number;
  events?: ItemEvent[];
  formData?: string;
  securityLevels?: string[];
  isConfidential?: boolean;
  itemGroup: ItemGroup;
  itemName: string | null;
  itemType: ItemType;
  noResponse: boolean;
  notes: string;
  selected?: boolean;
  startDate?: string | null;
  status?: string;
  tags?: TagsDto[];
  templateData?: ItemTemplateData; // present if adHocItem is false
  templateType?: string;
  type?: string;
  user?: InternalUserData | ExternalUserData | null;
  version?: number | null;
  category?: string;
}

export enum ItemType {
  AS_OF_DATE = 'AS_OF_DATE',
  DATE_RANGE = 'DATE_RANGE',
  NON_DATE = 'NON_DATE',
}

export interface RequestContactsData {
  // Optional requestId. Not present when loading contacts for Case.
  requestId?: number | null;
  firmIdExternalSelected?: number;
  lstFirmDataExternal: FirmData[];
  firmDataInternal: FirmData;

  // Supplemental data (used only on server validation for Create Request page)
  caseTypeCd: string;
  caseCategoryName: string;
  requiredRoles: FirmContactRoleDto[];
}

export interface PersonDto {
  userId: string;
  email: string;
  firmId?: number | string;
  orgClass?: string;
  fullName?: string; // @JsonInclude(JsonInclude.Include.NON_NULL)
  identityProvider?: string; // @JsonInclude(JsonInclude.Include.NON_NULL)
  //@JsonIgnore
  //roles: List<FirmContactRoleDto>  = new ArrayList<>();
}

export interface Firm {
  id: string;
  name: string;
}

export interface TagsData {
  finra8210: boolean;
  client8210: boolean;
}

export interface BusinessObjectDataKeyDto {
  partitionValue: string;
  namespace: string;
  businessObjectDefinitionName: string;
  businessObjectFormatUsage: string;
  businessObjectFormatFileType: string;
  businessObjectDataVersion: number;
  businessObjectFormatVersion: number;
}

// wording in the enum does not match ItemData.itemGroup, sic!
export enum ItemTemplateGroup {
  DOCUMENT = 'document',
  FORM = 'form',
  QUESTION = 'question',
  P_AND_S_BLOTTER = 'p&s blotter',
  ORDER_BLOTTER = 'order blotter',
}

export enum ItemTemplateType {
  SINGLE = 'SINGLE',
  RANGE = 'RANGE',
  NON = 'NON',
}

export interface ItemTemplateData {
  category?: string;
  externalDesc?: string;
  guidances?: AttachmentDto[];
  id: number | string | null;
  internalDesc?: string;
  isConfidential?: boolean;
  itemGroup?: ItemTemplateGroup;
  itemType?: ItemTemplateType;
  name?: string;
  nameShort?: string;
  noResponseAvailable?: boolean;
  notes?: string;
  tags?: Set<TagsDto>;
}

export interface RequestTemplate {
  name: string;
  id: string;
  description: string;
  messages?: {
    internalNotificationMessage?: string;
    externalNotificationMessage?: string;
    externalNonfirmNotificationMessage?: string;
    legalMessage?: string;
    subjectMessage?: string;
  };
}

export const fallbackRequestTemplate: RequestTemplate = {
  name: 'Fallback template',
  id: '0',
  description: 'Falback template description',
  messages: {
    externalNotificationMessage: 'externalNotificationMessage',
    externalNonfirmNotificationMessage: 'externalNotificationMessage',
    subjectMessage: 'Fallback subject',
  },
};

export interface InternalUserData {
  id: string;
  name: string;
  group: string;
  email: string;
  role?: string;
  identityProvider: 'isso';
  // Always false for Internal (Finra) users. For external (Firm) users belonging to required role(group), this is marked as true.
  required: false;
}

export interface ExternalUserData {
  id?: string;
  name: string;
  group: string | null;
  email: string;
  role?: string;
  identityProvider?: string;
  // Always false for Internal (Finra) users. For external (Firm) users belonging to required role(group), this is marked as true.
  required: boolean;
}

export interface TagsDto {
  key: string;
  value: string;
}

export interface FirmData {
  firmId: number | string;
  firmName: string;
  firmNameForUI?: string;
  // List of selected contacts for the firm.
  lstUserGroupDataSelected: UserGroupData[];
  // List of recommended contacts for the firm.
  lstUserDataAll: InternalUserData[] | ExternalUserData[];
}

export interface FirmContactRoleDto {
  id: number;
  name: string;
}

export interface AttachmentDto {
  id: number;
  lstUserData: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  businessObjectDataKey: BusinessObjectDataKeyDto;
  externalAttachmentUrl: string;
}

export interface UserGroupData {
  name: string | null;
  lstUserData: InternalUserData[] | ExternalUserData[];
}
