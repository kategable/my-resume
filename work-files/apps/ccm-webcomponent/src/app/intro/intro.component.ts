import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  IServerSideDatasource,
  RowGroupOpenedEvent,
  RowModelType,
  ValueFormatterParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { Observable, first, firstValueFrom } from 'rxjs';
import buildInfo from '../../environments/build-info.json';
import { Envelope, RequestTemplate } from '../api/envelope/envelope.api.interface';
import { DashboardQueryMapper } from '../common/converters/dashboard-query.mapper';
import { ConfigurationSettings } from '../common/models/settings.model';
import { RequestTemplateDataModel } from '../firm-request/models/request-template-data.model';
import { Config } from '../service/config/config.interface';
import { LogService } from '../service/log.service';
import { UiStateService } from '../service/ui-state.service';
import { ColumnsDefinitions } from './colums-def';
import { ItemDetailsCellRenderer } from './item-details/item-details.component';
import { IAccount } from './models';
const PAGE_SIZE: number = 10;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class IntroComponent {
  @Input() configurationSettings: ConfigurationSettings | undefined;
  @ViewChild('outboxSelectEnvelopeJson') outboxSelectEnvelopeJson: any;

  public showOpenCreateEnvelopeModal: boolean = false;
  public featureNotReady: boolean = false;
  public detailCellRenderer: any = ItemDetailsCellRenderer;
  public paginationPageNumber: number = 0;
  public rowModelType: RowModelType = 'serverSide';
  public rowData!: Envelope[];
  public rowSelection: 'single' | 'multiple' = 'single';
  public gridApi!: GridApi;
  public requestTemplates$: Observable<RequestTemplateDataModel>;
  public selectedTemplate: RequestTemplate | undefined;
  public selectedCriteria: string = 'all';
  public config: Config | undefined;
  public defaultColDef: ColDef = {
    flex: 1,
  };
  disableCreateButton = false;
  columnDefs = ColumnsDefinitions.definitions;
  paginationPageSize = DashboardQueryMapper.paginationPageSize;
  constructor(private uiStateService: UiStateService, private readonly log: LogService) {
    this.requestTemplates$ = uiStateService.requestTemplates$;
  }

  getRowHeight(params: any): number | undefined {
    const isDetailRow = params.node.detail;

    // for all rows that are not detail rows, return nothing
    if (!isDetailRow) {
      return 40; // this fits all 10 rows perfect with no scrollbar
    }
    // default height
    let detailPanelHeight = 58;
    // for no items
    if (!params.data.rm_items) return detailPanelHeight;
    // otherwise return height based on number of rows in detail grid
    detailPanelHeight = detailPanelHeight + params.data.rm_items.length * 27;
    return detailPanelHeight;
  }

  onRowGroupOpened(row: RowGroupOpenedEvent<any>) {
    if (!row.expanded) return;
    row.api.forEachNode(function (node) {
      if (row.node.id !== node.id) {
        node.setExpanded(false);
      }
    });
  }

  onGridReady(params: GridReadyEvent<IAccount>) {
    const datasource = this.getServerSideDatasource();
    params.api!.setServerSideDatasource(datasource);
    this.gridApi = params.api;
  }

  onTemplateSelect($event: any) {
    const detail = $event.detail;
    if (!detail.value) {
      return;
    }
    this.selectedTemplate = detail.value as RequestTemplate;
  }

  onCriteriaChange($event: any) {
    this.selectedCriteria = $event.detail;
  }

  getServerSideDatasource(): IServerSideDatasource {
    return {
      getRows: async (params) => {
        const result = await firstValueFrom(this.uiStateService.search(params));
        params.success({
          rowData: result.envelopes,
          rowCount: result.total,
        });
        this.paginationPageNumber =
          result.total < DashboardQueryMapper.paginationPageSize
            ? result.total
            : DashboardQueryMapper.paginationPageSize;
      },
    };
  }

  rowClicked(grid: any) {
    const envelopeId = grid.api.getSelectedRows()[0].envelope_id;
    this.editEnvelope(envelopeId);
  }

  onFilterTextBoxChanged($event: any) {
    const search = $event.target.value;
    this.gridApi.setQuickFilter(search);
    this.gridApi.onFilterChanged();
  }

  onSelectEnvelopeJson($event: any) {
    var file: File = $event?.target?.files[0];
    var fr = new FileReader();
    fr.onload = () => {
      var envelope = JSON.parse(fr.result as string) as Envelope;
      this.uiStateService.editEnvelopeObject(envelope);
    };
    fr.readAsText(file);
  }

  openCreateEnvelopeModal($event: any) {
    if (this.disableCreateButton) return;
    if ($event.ctrlKey) {
      // ctrl-create => show buildinfo dialog
      alert(JSON.stringify(buildInfo, null, 2));
      return;
    }
    if ($event.shiftKey) {
      //shift-create => load envelope from local JSON file
      if (this.configurationSettings?.enabledEnvelopeLocalImport) {
        let event = new MouseEvent('click', { bubbles: true });
        this.outboxSelectEnvelopeJson.nativeElement.dispatchEvent(event);
        return;
      }
    }

    this.disableCreateButton = true;
    if (this.configurationSettings?.enabledDefaultTemplate) {
      //TODO; refactor this logic out of here
      //to avoid subscribing
      const sub = this.requestTemplates$.pipe(first()).subscribe((requestTemplates) => {
        this.selectedTemplate = requestTemplates.recommended.find(
          (template) => template.name == this.configurationSettings?.defaultTemplateName
        );
        if (this.selectedTemplate) {
          this.createEnvelope();
        } else {
          this.log.error(
            'no default request template found, falling back to showing request template selection dialog'
          );
          this.showOpenCreateEnvelopeModal = true;
        }
        this.disableCreateButton = false;
      });
    } else {
      this.disableCreateButton = false;
      this.showOpenCreateEnvelopeModal = true;
    }
  }

  createEnvelope() {
    if (!this.selectedTemplate) return;
    this.uiStateService.createEnvelope(this.selectedTemplate);
  }

  editEnvelope(id: string) {
    this.uiStateService.editEnvelope(id);
  }

  openFeatureNotReadyModal() {
    this.featureNotReady = true;
  }

  closeFeatureNotReadyModal() {
    this.featureNotReady = false;
  }

  cancelCreateEnvelope() {
    this.showOpenCreateEnvelopeModal = false;
  }

  formatFinraUser(params: ValueFormatterParams) {
    return params?.value?.displayName || '';
  }

  onCloseDialog() {
    this.showOpenCreateEnvelopeModal = false;
  }
}
