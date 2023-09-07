import { ItemActionType } from '../api/envelope/enums/item-actions';
import { ItemAction } from '../firm-request/models/item-action-request.model';

export interface ActionStatuses {
  desc?: string;
  name: string;
  statuses: string[];
  confirmModal: boolean;
  modalMessage?: string;
  itemType: ItemActionType;
  showPanelMessage?: boolean;
  panelMessage?: string;
  panelHeaderMessage?: string;
  modalTitle?: string;
  modalOK?: string;
  status?: string;
  tag?: string;
  updateName?: ItemAction;
  isReject?: boolean;
}
const PANEL_MESSAGE_HEADER = 'Please provide reason for rejection (required).';
const PANEL_MESSAGE =
  'The text box below is included in the unencrypted email sent to the external recipients. Do not include any PCI/RCI information.';

export const ITEM_ACTIONS: ActionStatuses[] = [
  {
    desc: 'Changed Due Date',
    name: 'Change Due Date',
    itemType: ItemActionType.WITH_DATE,
    statuses: ['Open', 'Overdue', 'Re-opened'],
    confirmModal: false,
    updateName: ItemAction.changeDueDate,
  },
  {
    desc: 'Accepted Offline Submission',
    name: 'Accept Offline Submission',
    itemType: ItemActionType.WITH_UPDATE,
    status: 'Accepted',
    statuses: ['Open', 'Overdue', 'Re-opened'],
    modalOK: 'Accept',
    modalTitle: 'Confirm Acceptance',
    confirmModal: true,
    modalMessage: 'Are you sure you want to accept item without submitted files?',
    updateName: ItemAction.aos,
  },
  {
    desc: 'Accepted',
    name: 'Accept',
    itemType: ItemActionType.WITH_STATUS,
    status: 'Accepted',
    statuses: ['Submitted'],
    modalTitle: 'Confirm Acceptance',
    modalOK: 'Accept',
    confirmModal: true,
    modalMessage: 'Are you sure you want to accept this item?',
    updateName: ItemAction.accept,
  },
  {
    desc: 'Rejected',
    name: 'Reject',
    itemType: ItemActionType.WITH_STATUS,
    status: 'Re-Opened',
    statuses: ['Overdue', 'Submitted'],
    modalOK: 'Reject',
    modalTitle: 'Confirm Rejection',
    confirmModal: true,
    modalMessage: 'Are you sure you want to reject this item?',
    showPanelMessage: true,
    panelMessage: PANEL_MESSAGE,
    panelHeaderMessage: PANEL_MESSAGE_HEADER,
    isReject: true,
    updateName: ItemAction.reject,
  },
  {
    desc: 'Withdrew',
    name: 'Withdraw',
    itemType: ItemActionType.WITH_STATUS,
    status: 'Withdrawn',
    statuses: ['Open', 'Overdue', 'Submitted', 'Re-opened'],
    modalOK: 'Withdraw',
    modalTitle: 'Confirm Withdrawal',
    confirmModal: true,
    modalMessage: 'Are you sure you want to withdraw this item?',
    updateName: ItemAction.withdraw,
  },
  {
    desc: 'Partial Rejected',
    name: 'Partial Reject',
    itemType: ItemActionType.WITH_STATUS,
    status: 'Re-Opened',
    statuses: ['Overdue', 'Submitted'],
    modalOK: 'Reject',
    modalTitle: 'Confirm Rejection',
    confirmModal: true,
    modalMessage: 'Are you sure you want to partially reject this item?',
    showPanelMessage: true,
    panelMessage: PANEL_MESSAGE,
    panelHeaderMessage: PANEL_MESSAGE_HEADER,
    isReject: true,
  },
  { name: 'Add CAT flag', itemType: ItemActionType.WITH_TAGS, tag: 'CAT', statuses: ['All'], confirmModal: false },
  { name: 'Add RCI flag', itemType: ItemActionType.WITH_SECURITY, tag: 'RCI', statuses: ['All'], confirmModal: false },
  {
    name: 'Remove CAT flag',
    itemType: ItemActionType.WITH_TAGS,
    tag: 'REMOVE-CAT',
    statuses: ['All'],
    confirmModal: false,
  },
  {
    name: 'Remove RCI flag',
    itemType: ItemActionType.WITH_SECURITY,
    tag: 'REMOVE-RCI',
    statuses: ['All'],
    confirmModal: false,
  },
];
