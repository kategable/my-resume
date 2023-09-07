import { RequestTemplate } from '../../api/envelope/envelope.api.interface';

export interface RequestTemplateDataModel {
  recommended: RequestTemplate[];
  relevant: RequestTemplate[];
}
