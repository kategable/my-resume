export interface ICallRecord {
  title: string;
  label: string;
  caseId: string;
  status: string;
  Target: string;
  Requester: string;
  Requested: string;
  Due: string;
  Updated: string;
}

export interface IAccount {
  request_id: number;
  template_name: string;
  target: string;
  requester_KID: string;
  requested_date: string;
  due_date: string;
  last_updated_date: string;
  status: string;
  callRecords: ICallRecord[];
}
