import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';

export class Config {
  businessContext: BusinessContext = new BusinessContext();
  accessPolicyToApply: AccessPolicyToApply = new AccessPolicyToApply();
  contacts: Contacts[] = [];
  staffs: Staffs[] = [];
  constructor() {}
}

export namespace Config {
  export function getContacts(config: Config, type: string /* ContactCategoryType*/): Contacts[] {
    return config.contacts.filter((c) => c.category.includes(type));
  }

  export function getFirmContacts(config: Config): Contacts[] {
    return getContacts(config, ContactCategoryType.FIRM);
  }

  export function getFirmContact(config: Config, crdId: string): Contacts | undefined {
    const ret = config.contacts.filter((c) => c.category.includes(ContactCategoryType.FIRM) && c.crdId == crdId);
    return ret.shift();
  }

  export function getFirmContactByName(config: Config, firmName: string): Contacts | undefined {
    const ret = config.contacts.filter((c) => c.category.includes(ContactCategoryType.FIRM) && c.name == firmName);
    return ret.shift();
  }

  export function getNonFirmContactsWithEmail(config: Config): Contacts[] {
    return config.contacts.filter((c) => !c.category.includes(ContactCategoryType.FIRM) && c.businessEmail?.length > 0);
  }
}

export class BusinessContext {
  contextName: string = '';
  businessId: string = '';
  correlationId: string = '';
  client: string = '';
  templateId: string = '';
  businessObjects: BusinessObjects[] = [];

  constructor() {}
}

export class BusinessObjects {
  idKey: string = '';
  idValue: string = '';
  constructor() {}
}

export class AccessPolicyToApply {
  id: string = '';
  tag: string = 'CCM-Open';
  businessObjects: BusinessObjects[] = [];
  constructor() {}
}

export enum ContactCategoryType {
  FIRM = 'Firm',
  REP = 'Rep',
  BRANCH = 'Branch',
  INDIVIDUAL = 'Individual',
}

export class Contacts {
  crdId: string = '';
  name: string = '';
  category: string = ''; // ContactCategoryType: 'Firm'|  'Rep' |  'Branch' |  'Individual'
  contactType: string[] = [];
  roleContacts?: { role?: { name?: string } }[] = [];
  primaryFlag: boolean = false;
  businessEmail: string[] = [''];
  constructor() {
    this.crdId = '';
    this.name = '';
    this.category = '';
    this.contactType = [];
    this.roleContacts = [];
    this.primaryFlag = false;
    this.businessEmail = [''];
  }
}

export class Staffs {
  userId: string = '';
  fullName: string = '';
  primaryFlag: boolean = false;
  role: string = '';
  email: string = '';
  constructor() {}
}

export interface Tag {
  id: number;
  name: string;
}
