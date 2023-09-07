import { ActionStatuses } from '../../service/action-statuses-data';
import { EnvelopeViewModel, ItemDataViewModel } from './envelope-view-model';
import { Contacts } from '../../service/config/config.interface';
import { ExternalUserData } from '../../api/envelope/envelope.api.interface';

export interface PatchRequest {
  viewModel: EnvelopeViewModel;
  itemModel: ItemDataViewModel;
  action: ActionStatuses;
  note: string;
  date: string;
}

export interface PatchBase {
  dataversion?: number;
  updateReason?: string; // required for PATCH status
  updateDate?: string; // ISO  https://www.w3.org/TR/NOTE-datetime : "2017-04-14T17:46:26.069-04:00" "2017-04-14T17:46:26.000-04:00" "2017-04-14"
}

export interface PatchFormData extends PatchBase {
  formData: string;
}
export interface PatchSecurityLevels extends PatchBase {
  securityLevels: ['RCI'] | ['NONE'];
}

export interface KeyValuePair extends PatchBase {
  key: string;
  value: string | null;
}
export interface PatchTags extends PatchBase {
  tags: KeyValuePair[];
}

export interface PatchComment extends PatchBase {
  updateReason: string;
}

export interface PatchDueDate extends PatchBase {
  dates: {
    dueDate: string; // ISO date YYYY-MM-DD
  };
}

// see allowed status transitions table at RM wiri referenced above
export interface PatchStatus extends PatchBase {
  status: string;
}

export interface PatchAssignees extends PatchBase {
  assignees: (IndividualAssignee | FirmAssignee)[];
  notifications: Notification[];
}

export interface IndividualAssignee {
  userId: null | string;
  email: string;
}

export interface FirmAssignee {
  orgId: string;
}

export interface Notification {
  id: number | null;
  userId: null | string;
  firstName: null | string;
  lastName: null | string;
  email: string;
  identityProvider: string;
  orgId: number;
  phone: null;
  phoneExt: null;
  orgClass: null | string;
  group: null | string;
}
export type PatchData =
  | PatchFormData
  | PatchSecurityLevels
  | PatchTags
  | PatchComment
  | PatchDueDate
  | PatchStatus
  | PatchAssignees;
