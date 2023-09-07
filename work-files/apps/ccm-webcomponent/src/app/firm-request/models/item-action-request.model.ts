// usage: ItemAction.aos or ItemAction[ItemAction.aos]
export enum ItemAction {
  accept = 'accept',
  aos = 'aos',
  changeDueDate = 'changeDueDate',
  reject = 'reject',
  submit = 'submit',
  withdraw = 'withdraw',
}

export interface ItemActionRequest {
  itemId: number;
  comments: string;
  dueDate?: string | null;
}
