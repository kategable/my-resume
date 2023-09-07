export class ContentStorage {
  contextTypeName: string | undefined;
  description:
    | {
        brief: string;
        full: string;
      }
    | undefined;
  storageProviderName: string | undefined;
  constructor() {}
}

export class DeliveryChannel {
  code: string | undefined;
  description:
    | {
        brief: string;
        full: string;
      }
    | undefined;
  constructor() {}
}

export class BusinessContext {
  code: string | undefined;
  contentStorage: ContentStorage | undefined;
  deliveryChannels: DeliveryChannel[] | undefined;
  description:
    | {
        brief: string;
        full: string;
      }
    | undefined;
  constructor() {}
}

export interface Configuration {
  group: string;
  key: string;
  value: string;
}
