import {
  Envelope,
  ExternalUserData,
  Firm,
  InternalUserData,
  PersonDto,
  RequestTemplate,
} from '../../api/envelope/envelope.api.interface';
import { EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';
import { ExternalContact } from '../../firm-request/models/external-contacts.model';
import { Config, Contacts, Staffs } from '../../service/config/config.interface';

export interface IMapper<T, U> {
  (value: T): U;
}

export function mapList<T, U>(mapper: IMapper<T, U>): (value: T[]) => U[] {
  return (value: T[]): U[] => {
    if (value) return value.map(mapper);
    return [];
  };
}

export interface ViewModelSource {
  envelope: Envelope;
  config: Config;
  selectedTemplate: RequestTemplate | null;
}
