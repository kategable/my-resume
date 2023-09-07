import { forEach } from 'lodash';
import { DateTime } from 'luxon';
import { BusinessContext } from '../service/config/config.interface';
// *** sample filterModel
// unfortunately, it can not be fully typescript-typed, as object keys are column names
// filterModel= {
//    recipient: {
//      filterType: 'text',
//      operator: 'AND',
//      conditions: [
//       {
//          filterType: 'startsWith',
//          type: 'text',
//          filter: 'Oleg'
//        },
//        {
//          filterType: 'endsWith',
//          type: 'text',
//          filter: 'enko'
//        }
//      ]
//    },
//    dueDate: {
//      filterType: 'date',
//      type: 'inRange',
//      dateFrom: '2022-11-11 00:00:00',
//      dateTo: '2023-12-12 00:00:00'
//    }
// }

interface DateFilterLeafCondition {
  filterType: 'date';
  type: 'greaterThan' | 'lessThan' | 'equals' | 'notEqual' | 'inRange' | 'blank' | 'notBlank';
  dateFrom?: string; // '2022-11-11 00:00:00', optional for filterType:'blank'|'notBlank'
  dateTo?: string; // ibid
}

interface DateFilterBranchCondition {
  filterType: 'date';
  operator: 'AND' | 'OR';
  conditions: DateFilterLeafCondition[];
}

interface TextFilterLeafCondition {
  filterType: 'text';
  type: 'contains' | 'notContains' | 'equals' | 'notEqual' | 'startsWith' | 'endsWith' | 'blank' | 'notBlank';
  filter?: string; // optional for filterType:'blank'|'notBlank'
}

interface TextFilterBranchCondition {
  filterType: 'text';
  operator: 'AND' | 'OR';
  conditions: TextFilterLeafCondition[];
}

type TextFilterCondition = TextFilterBranchCondition | TextFilterLeafCondition;
type DateFilterCondition = DateFilterBranchCondition | DateFilterLeafCondition;
type FilterCondition = TextFilterCondition | DateFilterCondition;

// backslash-escape ElasticSearch special characters
const regexToReplace = /([\\\+\-\!\(\)\:\^\[\]\"\{\}\~\*\'\?\|\&\/])/g;
function esEscape(str: string | undefined): string | undefined {
  return str?.replace(regexToReplace, '\\$1');
}

export function buildFilterQuery(filterModel: any, businessContext: BusinessContext): string {
  var filterClauses: (string | null)[] = [];

  //TODO: remove this when we have a proper businessContext is added to search API
  const businessContextQuery: string[] = [];
  // if (businessContext.businessId) {
  //   filterClauses.push(`rm_caseId:${esEscape(businessContext.businessId)}`);
  // }

  if (businessContext.businessId) {
    businessContextQuery.push(`tags:businessId:${esEscape(businessContext.businessId)}`);
  }
  forEach(businessContext.businessObjects, (value, key) => {
    businessContextQuery.push(`tags:${value.idKey}:${value.idValue}`);
  });

  filterClauses.push(businessContextQuery.join(' AND '));

  if (filterModel) {
    Object.keys(filterModel).forEach((column) => {
      const filter = filterModel[column];
      const filterClause = getFilterClause(filter as FilterCondition, column);
      if (filterClause) filterClauses.push(filterClause);
    });
  }
  return esEscape(filterClauses.join(' AND ')) + '';
}

function getFilterClause(filter: FilterCondition, column: string): string {
  if ('type' in filter) {
    // leaf
    if (filter.filterType == 'text')
      return getTextFilterLeafClause(filter as unknown as TextFilterLeafCondition, column);
    else return getDateFilterLeafClause(filter as unknown as DateFilterLeafCondition, column);
  } else {
    // branch
    return getFilterBranchClause(filter as unknown as TextFilterBranchCondition, column);
  }
}

function getFilterBranchClause(filter: TextFilterBranchCondition | DateFilterBranchCondition, column: string): string {
  const clause = filter.conditions
    .map((c) => (c.filterType === 'text' ? getTextFilterLeafClause(c, column) : getDateFilterLeafClause(c, column)))
    .join(` ${filter.operator} `);
  return `(${clause})`;
}

function getTextFilterLeafClause(filter: TextFilterLeafCondition, column: string): string {
  const term = esEscape(filter.filter);
  switch (filter.type) {
    case 'contains':
      return `${column}:*${term}*`;
    case 'notContains':
      return `NOT ${column}:*${term}*`;
    case 'equals':
      return `${column}:${term}`;
    case 'notEqual':
      return `NOT ${column}:${term}`;
    case 'startsWith':
      return `${column}:${term}*`;
    case 'endsWith':
      return `${column}:*${term}`;
    case 'notBlank':
      return `_exists_:${column}`;
    case 'blank':
      return `NOT _exists_:${column}`;
    default:
      throw `unknown filter.type: ${filter.type}`;
  }
}

function getDateFilterLeafClause(filter: DateFilterLeafCondition, column: string): string {
  const startDay = (date: DateTime) => date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toMillis() - 1;
  const endDay = (date: DateTime) => date.set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).toMillis();

  const dateNy = (dateStr: string | undefined) =>
    dateStr ? DateTime.fromFormat(dateStr, 'yyyy-MM-dd HH:mm:ss', { zone: 'America/New_York' }) : DateTime.now();

  const dateFrom = dateNy(filter.dateFrom);
  const dateTo = dateNy(filter.dateTo);

  switch (filter.type) {
    case 'greaterThan':
      return `${column}:{${endDay(dateFrom)} TO *}`;
    case 'lessThan':
      return `${column}:{* TO ${startDay(dateFrom)}}`;
    case 'equals':
      return `${column}:{${startDay(dateFrom)} TO ${endDay(dateFrom)}}`;
    case 'notEqual':
      return `(${column}:{* TO ${startDay(dateFrom)}} OR ${column}:{${endDay(dateFrom)} TO *})`;
    case 'inRange':
      return `${column}:{${startDay(dateFrom)} TO ${endDay(dateTo)}}`;
    case 'notBlank':
      return `_exists_:${column}`;
    case 'blank':
      return `NOT _exists_:${column}`;
    default:
      throw `unknown filter.type: ${filter.type}`;
  }
}
