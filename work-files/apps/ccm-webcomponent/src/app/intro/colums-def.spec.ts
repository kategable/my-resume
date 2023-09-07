import { ColumnsDefinitions } from './colums-def';

describe('ColumnsDefinitions', () => {
  it('should formatDate', () => {
    const result = ColumnsDefinitions.formatDate({ value: 1678486001477 } as any);
    expect(result).toEqual('3/10/2023');
  });
  it('should return collect definitions', () => {
    const result = ColumnsDefinitions.definitions;
    expect(result.length).toEqual(9);
  });
});
