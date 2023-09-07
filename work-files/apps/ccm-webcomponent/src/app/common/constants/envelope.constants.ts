import { ItemTemplateGroup } from '../../api/envelope/envelope.api.interface';
import ItemTemplate from '../../firm-request/models/item-template';
export const FIRM_ID_INTERNAL = '1';
export const FIRM_ID_EXTERNAL = '-2';
export const PUBLIC = 'PUBLIC';
export const REGULATORY_INQUIRIES = 'Regulatory Inquiries';
export const DELIVERY_CHANNEL_CODE = 'RM';
export const COMPONENT_DEBOUNCE_TIME_MILLIS = 500;
export const DEFAULT_EMAIL_SUBJECT = 'FINRA Request for';
export const ADHOC_ITEM: ItemTemplate = {
  group: 'ITEM',
  adHocFlag: true,
  id: null,
  name: 'Ad Hoc Request',
  datesSetup: {
    code: 'as-of-date',
    description: 'Controls UI for single date entry field',
  },
  attributes: {
    activeFlag: true,
    noResponseFlagAvailable: true,
  },
  accessType: {
    code: 'PUBLIC',
  },
  type: ItemTemplateGroup.DOCUMENT,
  category: {
    name: 'Other',
  },
  tags: [],
  note: {
    id: 123,
    text: '',
  },
  d2iFlag: false,
  hasClearingFirm: true,
};
