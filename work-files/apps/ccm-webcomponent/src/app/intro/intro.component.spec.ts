import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';
import { ConfigFacade } from '../service/config/config.facade';
import { UiStateService } from '../service/ui-state.service';
import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let uiStateService: UiStateService;
  // let envelopeApiFacade: EnvelopeApiFacade;
  let configFacade: ConfigFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroComponent],
      imports: [HttpClientModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    uiStateService = TestBed.inject(UiStateService);
    // envelopeApiFacade = TestBed.inject(EnvelopeApiFacade);
    configFacade = TestBed.inject(ConfigFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onGridReady', () => {
    const spy = spyOn(component, 'getServerSideDatasource');
    // @ts-ignore
    component.onGridReady({
      api: {
        setServerSideDatasource: (r: any) => {
          expect(r).toBeUndefined();
        },
      },
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('getServerSideDatasource', () => {
    const spy = spyOn(uiStateService, 'search').and.returnValue(new BehaviorSubject({ envelopes: [], total: 2 }));
    const result = component.getServerSideDatasource();
    expect(result.getRows).toBeTruthy();
    // @ts-ignore
    result.getRows({
      request: { sortModel: [], filterModel: {} },
      api: { getQuickFilter: () => {} },
      success: (r: any) => {
        expect(r).toEqual({ rowData: [], rowCount: 2 });
      },
    } as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should openCreateEnvelopeModal with !enabledDefaultTemplate', () => {
    component.configurationSettings = { enabledDefaultTemplate: false } as any;
    expect(component.showOpenCreateEnvelopeModal).toBeFalsy();

    component.openCreateEnvelopeModal({});
    expect(component.showOpenCreateEnvelopeModal).toBeTruthy();
  });
  it('should openCreateEnvelopeModal with enabledDefaultTemplate', () => {
    component.requestTemplates$ = new BehaviorSubject<any>(null);
    (component.requestTemplates$ as any).next({ recommended: [{ name: 'tests' }] } as any);
    component.configurationSettings = { enabledDefaultTemplate: true, defaultTemplateName: 'tests' } as any;
    const spy = spyOn(component, 'createEnvelope');
    component.openCreateEnvelopeModal({});
    expect(spy).toHaveBeenCalled();
  });
  it('should open file on openCreateEnvelopeModal with shift', () => {
    component.configurationSettings = { enabledEnvelopeLocalImport: true } as any;
    component.outboxSelectEnvelopeJson = { nativeElement: { dispatchEvent: () => {} } } as any;
    const spy = spyOn(component.outboxSelectEnvelopeJson.nativeElement, 'dispatchEvent');
    component.openCreateEnvelopeModal({ shiftKey: true });
    expect(spy).toHaveBeenCalled();
  });
  it('should open file on openCreateEnvelopeModal with shctrlKeyift', () => {
    component.configurationSettings = { enabledEnvelopeLocalImport: true } as any;
    spyOn(window, 'alert').and.callThrough();
    component.openCreateEnvelopeModal({ ctrlKey: true });
    expect(window.alert).toHaveBeenCalled();
  });
  it('should createEnvelope', () => {
    const template = {} as any;
    component.selectedTemplate = template;
    const uiStateServiceSpy = spyOn(uiStateService, 'createEnvelope');
    component.createEnvelope();

    expect(uiStateServiceSpy).toHaveBeenCalledWith(template);
  });

  it('should not call createEnvelope', () => {
    component.selectedTemplate = undefined;
    const uiStateServiceSpy = spyOn(uiStateService, 'createEnvelope');
    component.createEnvelope();

    expect(uiStateServiceSpy).not.toHaveBeenCalled();
  });

  it('should cancelCreateEnvelope', () => {
    component.showOpenCreateEnvelopeModal = true;
    component.cancelCreateEnvelope();
    expect(component.showOpenCreateEnvelopeModal).toBeFalsy();
  });

  it('should rowClicked', () => {
    const grid = { api: { getSelectedRows: () => [{ envelope_id: '123' }] } };
    const spy = spyOn(component, 'editEnvelope');
    component.rowClicked(grid);
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should editEnvelope', fakeAsync(() => {
    const uiSpyStateSpy = spyOn(uiStateService, 'editEnvelope');
    component.editEnvelope('123');

    tick(500);
    expect(uiSpyStateSpy).toHaveBeenCalledWith('123');
  }));

  it('should close all other rows onRowGroupOpened', fakeAsync(() => {
    const node = {
      id: 2,
      expanded: true,
      setExpanded: function (expand: boolean) {
        this.expanded = expand;
      },
    };
    const row = {
      expanded: true,
      node: { id: 1 },
      api: {
        forEachNode: (func: any) => {
          [node].forEach((node) => func(node));
        },
      },
    };
    // @ts-ignore
    component.onRowGroupOpened(row);
    expect(node.expanded).toBeFalse();
  }));

  it('should openFeatureNotReadyModal', () => {
    expect(component.featureNotReady).toBeFalse();
    component.openFeatureNotReadyModal();
    expect(component.featureNotReady).toBeTrue();
  });

  it('should closeFeatureNotReadyModal', () => {
    component.openFeatureNotReadyModal();
    expect(component.featureNotReady).toBeTrue();
    component.closeFeatureNotReadyModal();
    expect(component.featureNotReady).toBeFalse();
  });

  it('should update config on template select', () => {
    component.onTemplateSelect({ detail: { value: '12312', text: 'Test Template' } });
    expect(component.selectedTemplate).toBeDefined();
  });

  it('should not update config when no template passed', () => {
    const spy = spyOn(configFacade, 'updateConfig');
    component.onTemplateSelect({ detail: { value: '', text: '' } });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set selected criteria', () => {
    component.onCriteriaChange({ detail: 'all' });
    expect(component.selectedCriteria).toEqual('all');
  });

  it('should update search criteria', () => {
    component.onCriteriaChange({ detail: 'test' });
    expect(component.selectedCriteria).toEqual('test');
  });

  // xit('should buildFilterQuery', () => {
  //   const filterModel = {
  //     recipient: {
  //       filterType: 'text',
  //       operator: 'AND',
  //       conditions: [
  //         {
  //           type: 'startsWith',
  //           filterType: 'text',
  //           filter: 'Oleg',
  //         },
  //         {
  //           type: 'endsWith',
  //           filterType: 'text',
  //           filter: 'enko',
  //         },
  //       ],
  //     },
  //     dueDate: {
  //       filterType: 'date',
  //       type: 'inRange',
  //       dateFrom: '2022-11-11 00:00:00',
  //       dateTo: '2023-12-12 00:00:00',
  //     },
  //   };
  //   component.caseId = 'case123';
  //   const query = component.getFilterQuery(filterModel);
  //   expect(query).toEqual(
  //     'rm_caseId:case123 AND (recipient:Oleg* AND recipient:*enko) AND dueDate:{1668142799999 TO 1702443599999}'
  //   );
  // });
  it('should return correct height with getRowHeight', () => {
    const params = {
      node: {
        detail: true,
      },
      data: {
        rm_items: [{}, {}],
      },
    };
    const result = component.getRowHeight(params);
    expect(result).toEqual(112);
  });
  it('should return 40 height with getRowHeight', () => {
    const params = {
      node: {
        detail: false,
      },
    };
    const result = component.getRowHeight(params);
    expect(result).toEqual(40);
  });
  it('should return 58 height when no items with getRowHeight', () => {
    const params = {
      node: {
        detail: true,
      },
      data: {
        rm_items: null,
      },
    };
    const result = component.getRowHeight(params);
    expect(result).toEqual(58);
  });

  it('should not call api if row is not expanded on onRowGroupOpened', () => {
    const mockGridApi = new GridApi();
    const nodes = [
      {
        data: {
          id: '6149fa57f119aa206c420f44',
        },
      },
    ];
    const row = {
      expanded: false,
      api: nodes,
    };

    const spy = spyOn(mockGridApi, 'forEachNode');
    const result = component.onRowGroupOpened(row as any);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should show display name on formatFinraUser', () => {
    const user = {
      value: { displayName: 'test' },
    } as any;
    const result = component.formatFinraUser(user);
    expect(result).toEqual('test');
  });
  it('should set showOpenCreateEnvelopeModal to true on onCloseDialog', () => {
    component.showOpenCreateEnvelopeModal = true;
    component.onCloseDialog();
    expect(component.showOpenCreateEnvelopeModal).toBeFalsy();
  });
});
