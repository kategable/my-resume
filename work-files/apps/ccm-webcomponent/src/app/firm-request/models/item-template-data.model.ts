import { ItemTemplateApi } from '../../api/envelope/template.api.interface';

export interface ItemTemplateDataModel {
  recommended: ItemTemplateApi[];
  all: ItemTemplateApi[];
}
