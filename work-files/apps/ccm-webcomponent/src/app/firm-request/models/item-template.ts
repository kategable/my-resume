import { ItemTemplateGroup } from '../../api/envelope/envelope.api.interface';

export default interface ItemTemplate {
  accessType: AccessType;
  adHocFlag: boolean;
  attachments?: string;
  attributes: Attributes;
  category: Category;
  d2iFlag: boolean;
  datesSetup: DatesSetup;
  department?: string;
  description?: string;
  group: string;
  hasClearingFirm?: boolean;
  id: number | null;
  name: string;
  note?: Note;
  orgOwner?: string;
  tags: string[];
  type: ItemTemplateGroup; // wording in the set does not match ItemData.itemGroup, sic!;
}

export interface AccessType {
  code: string;
}

export interface Attributes {
  activeFlag: boolean;
  noResponseFlagAvailable: boolean;
}

export interface Category {
  name: string;
}

export interface DatesSetup {
  code: string;
  description: string;
}

export interface Note {
  id: number;
  text: string;
}
