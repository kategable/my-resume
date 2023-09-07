import { ItemTemplateGroup } from './envelope.api.interface';

export interface ItemTemplateApi {
  adhocItem: boolean;
  group: 'ITEM';
  id: number | null;
  name: string;
  orgOwner?: any;
  description: string | null;
  parent?: {
    id: number;
    name: string;
  } | null;
  datesSetup: {
    code: 'date-range' | 'as-of-date';
    description: string;
  };
  attributes: {
    activeFlag: boolean;
    noResponseFlagAvailable: boolean;
  };
  department?: any;
  accessType?: {
    code: 'PRIVATE' | 'PUBLIC';
  };
  note?: {
    id: number;
    text: string;
  };
  type: ItemTemplateGroup;
  category?: {
    name: string;
  };
  attachments?: any;
  tags?: any;
}

export namespace ItemTemplateApi {
  export const AD_HOC_ITEM_NAME = 'Ad Hoc Item';

  export const ADHOC_ITEM_TEMPLATE_API: ItemTemplateApi = {
    adhocItem: true,
    group: 'ITEM',
    id: null,
    category: { name: '' },
    name: AD_HOC_ITEM_NAME,
    description: 'Ad Hoc is free-form request item',
    parent: null,
    attributes: {
      activeFlag: true,
      noResponseFlagAvailable: true,
    },
    datesSetup: {
      code: 'date-range',
      description: 'Controls UI for single date entry field',
    },
    type: ItemTemplateGroup.DOCUMENT,
  };

  export function isD2i(itemTemplateApi: ItemTemplateApi): boolean {
    return (
      itemTemplateApi.type == ItemTemplateGroup.P_AND_S_BLOTTER ||
      itemTemplateApi.type == ItemTemplateGroup.ORDER_BLOTTER
    );
  }
}
