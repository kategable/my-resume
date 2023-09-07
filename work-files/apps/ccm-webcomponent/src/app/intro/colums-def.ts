import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { DateTime } from 'luxon';

export class ColumnsDefinitions {
  public static formatDate(params: ValueFormatterParams) {
    return params.value ? DateTime.fromMillis(params.value, { zone: 'America/New_York' }).toFormat('M/d/yyyy') : '';
  }
  public static definitions: ColDef[] = [
    // group cell renderer needed for expand / collapse icons
    {
      headerName: 'ID',
      field: 'rm_request_id',
      cellRenderer: 'agGroupCellRenderer',
      sortable: true,
    },
    {
      headerName: 'Description',
      field: 'rm_request_type',
      sortable: true,
    },
    {
      headerName: 'Recipient',
      field: 'rm_target', // TODO: refactor the name all the way through API
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requestor',
      field: 'created_by.displayName',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Requested',
      field: 'created_date',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: this.formatDate,
    },
    {
      headerName: 'Due',
      field: 'rm_due_date',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: this.formatDate,
    },
    {
      headerName: 'Last Updated',
      field: 'updated_date',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: this.formatDate,
    },
    {
      headerName: 'Updated By',
      field: 'updated_by.displayName',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Status',
      field: 'rm_status',
      sortable: true,
      filter: 'agTextColumnFilter',
    },
  ];
}
