import { ItemTemplateApi } from '../../api/envelope/template.api.interface';
import { templateMapper } from './template-to-item.mapper';
import { ADHOC_ITEM } from '../constants/envelope.constants';
import { ItemTemplateGroup } from '../../api/envelope/envelope.api.interface';

//add tests for template-to-item.mapper.ts
describe('template-to-item.mapper', () => {
  it('should set name to null if ad hoc itemm', () => {
    const template: ItemTemplateApi = {
      adhocItem: true,
      id: 1,
      name: 'test',
      description: 'test',
      datesSetup: {
        code: 'as-of-date',
        description: 'test',
      },
      attributes: {
        activeFlag: true,
        noResponseFlagAvailable: false,
      },
      type: ItemTemplateGroup.DOCUMENT,
    } as any;

    const result = templateMapper(template);
    expect(result.item.itemName).toEqual(null);
    expect(result.selected).toEqual(false);
  });
});
