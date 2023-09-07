export interface ExternalContact {
  id: string;
  person: Person;
  firmRelationships: ExternalFirmRelationship[];
  roleContacts: RoleContact[];
  contactInfo: ExternalContactInfo;
}

export interface ExternalContactInfo {
  addresses: AddressElement[];
  emails: Email[];
}

export interface AddressElement {
  label: Label;
  address: AddressAddress;
}

export interface AddressAddress {
  city: City;
}

export enum City {
  Alpharetta = 'ALPHARETTA',
}

export enum Label {
  Primary = 'Primary',
}

export interface Email {
  emailAddress: string;
  label: string;
  primary: boolean;
}

export interface ExternalFirmRelationship {
  id: string;
  name: Name;
  filterFlag: boolean;
  description: string;
  firmRelationshipId: string;
  value: string;
  typeCode: null;
}

export enum Name {
  AlternateInfoReq = 'AlternateInfoReq',
  RegisteredPrincipal = 'RegisteredPrincipal',
  RegisteredRep = 'RegisteredRep',
  WorksForFirm = 'WorksForFirm',
}

export interface Person {
  firstName: string;
  lastName: string;
}

export interface RoleContact {
  assignedTimestamp: string;
  role: Role;
  contactInfo: RoleContactContactInfo;
}

export interface RoleContactContactInfo {
  addresses: AddressElement[];
}

export interface Role {
  id: string;
  name: string;
  required: boolean;
  annualReport: boolean;
  description: string;
  firmRelationships: RoleFirmRelationship[];
}

export interface RoleFirmRelationship {
  firmRelationshipId: string;
  id: string;
  name: Name;
}
