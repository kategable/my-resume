import { DashboardQueryMapper } from './dashboard-query.mapper';

//add tests for dashboard-query.mapper.ts
describe('DashboardQueryMapper', () => {
  xit('getFilterTextQuery', () => {
    const filterModel = { created_by: { filterType: 'text', type: 'equals', filter: 'K30012' } };
    const filterQuery = DashboardQueryMapper.getFilterQuery(filterModel, {} as any);
    expect(filterQuery).toEqual(' AND created_by:K30012');
  });
  it('should getSortOrder', () => {
    expect(DashboardQueryMapper.getSortOrder('asc')).toBe('ASC');
    expect(DashboardQueryMapper.getSortOrder('desc')).toBe('DESC');
  });
  xit('should map data on paramsToQueryMapper', () => {
    const params = {
      filterModel: {
        created_by: { filterType: 'text', type: 'equals', filter: 'K30012' },
        created_at: { filterType: 'date', type: 'equals', filter: '2021-01-01' },
        updated_at: { filterType: 'date', type: 'equals', filter: '2021-01-01' },
        status: { filterType: 'text', type: 'equals', filter: 'active' },
        name: { filterType: 'text', type: 'equals', filter: 'test' },
        id: { filterType: 'text', type: 'equals', filter: '1' },
        sort: { colId: 'created_at', sort: 'asc' },
      },
      request: {
        sortModel: [{ colId: 'created_at', sort: 'asc' }],
      },
      startRow: 0,
      endRow: 10,
      api: { getQuickFilter: () => 'test' },
    };
    const config = {
      businessContext: {
        businessId: '202307893251',
        businessObjects: [
          {
            idKey: 'case',
            idValue: '92a32948-23de-4fd6-9c3c-651aca32b921',
          },
          {
            idKey: 'outcome',
            idValue: 'fe1fda2a-1c0a-43b5-aa63-6bd824aca6c6',
          },
        ],
      } as any,
    } as any;
    const query = DashboardQueryMapper.paramsToQueryMapper(params, config.businessContext);
    expect(query).toEqual({
      sortOn: 'created_at',
      sortOrder: 'ASC',
      searchText: 'test',
      filterQuery: `businessId:202307893251&key:case&value:92a32948-23de-4fd6-9c3c-651aca32b921&key:outcome&value:fe1fda2a-1c0a-43b5-aa63-6bd824aca6c6`,
      page: 0,
      size: 10,
    } as any);
  });
});
