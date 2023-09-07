import { buildFilterQuery } from '../../intro/query-builder';
import { BusinessContext } from '../../service/config/config.interface';
const PAGE_SIZE: number = 10;

export class DashboardQueryMapper {
  public static paginationPageSize: number = PAGE_SIZE;

  public static paramsToQueryMapper = (params: any, businessContext: BusinessContext): string => {
    const query: any = {};
    if (params.request.sortModel[0]) {
      query.sortOn = params.request.sortModel[0].colId;
      query.sortOrder = this.getSortOrder(params.request.sortModel[0].sort);
    }

    const searchText = params.api.getQuickFilter();
    if (searchText) query.searchText = searchText;

    const filterQuery = this.getFilterQuery(params.request.filterModel, businessContext);
    if (filterQuery) query.filterQuery = filterQuery;

    query.page = this.getPageNumber(params.request.startRow || 0);
    query.size = PAGE_SIZE;
    return query;
  };
  public static getSortOrder(type: string): string {
    return type === 'asc' ? 'ASC' : 'DESC';
  }

  public static getFilterQuery(filterModel: any, businessContext: BusinessContext): string {
    return buildFilterQuery(filterModel, businessContext);
  }
  private static getPageNumber(startRow: number): number {
    let pageNumber = startRow / this.paginationPageSize;
    return startRow == 0 ? 0 : pageNumber;
  }
}
