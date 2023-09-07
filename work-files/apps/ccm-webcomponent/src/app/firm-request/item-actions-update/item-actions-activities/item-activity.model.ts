export interface ItemActivity {
  itemId: number;
  name: string;
  notes: string;
  caseId: string;
  displayCaseInternal: boolean;
  displayCaseExternal: boolean;
  requestId: number;
  requestedDate: string;
  targetName: string;
  targetId: number;
  assignedTo: string;
  assignedToUser: User;
  requestor: string;
  requestorUser: User;
  startDate: null;
  endDate: null;
  asOfDate: string;
  dueDate: string;
  lastUpdateDate: string;
  lastSubmissionDate: string;
  status: string;
  comments: string;
  formattedComments: string;
  commentByUser: string;
  commentDate: string;
  ewsCommentCount: number;
  issoCommentCount: number;
  dynoUrl: null;
  overdue: boolean;
  confidential: boolean;
  partiallySubmitted: boolean;
  partialSubmissionAllowed: boolean;
  evergreenAllowed: boolean;
  orgOwner: string;
  issoActionAllowed: boolean;
  category: string;
  itemType: string;
  itemGroup: string;
  pilot: boolean;
  guidances: any[];
  documents: Document[];
  events: Event[];
  tags: any[];
  noResponse: boolean;
}

export interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  identityProvider: string;
  orgId: number;
  phone: null;
  phoneExt: null;
  orgClass: string;
  group: null;
}

export interface Document {
  filename: string;
  fileSize: number;
  contentType: string;
  uploadDate: string;
  attachmentId: number;
  uuid: string;
  uploadStatus: string;
  businessDataKey: BusinessDataKey;
  attachmentUrl: string;
  externalAttachmentUrl: null;
}

export interface BusinessDataKey {
  partitionValue: string;
  namespace: string;
  businessObjectDefinitionName: string;
  businessObjectFormatUsage: string;
  businessObjectFormatFileType: string;
  businessObjectDataVersion: number;
  businessObjectFormatVersion: number;
}

export interface ItemEvent {
  eventId: number;
  action: string;
  createDate: string;
  userName: string;
  comments: string;
  formattedComments: string;
  dueDate: null | string;
  dynoUrl: null;
  user: User;
  documents: Document[];
}
