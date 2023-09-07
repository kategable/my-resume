import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsInRequestComponent } from './items-in-request.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UiStateService } from '../../service/ui-state.service';
import { ItemData, ItemType } from '../../api/envelope/envelope.api.interface';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import EnvelopeStatus from '../enums/envelope-status';
import { of, take } from 'rxjs';
import { Contacts } from '../../service/config/config.interface';
import { FirmRequestService } from '../service/firm-request.service';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { StaffFormatPipe } from '../../common/pipes/staff-format.pipe';
import { SentAttachmentPipe } from '../../common/pipes/sent-attachment.pipe';
import { ReceivedDocumentsPipe } from '../../common/pipes/received-documents.pipe';

describe('ItemsInRequestComponent', () => {
  let component: ItemsInRequestComponent;
  let fixture: ComponentFixture<ItemsInRequestComponent>;
  let mockFirmRequestService: SpyObj<FirmRequestService>;
  let mockUiStateService: SpyObj<UiStateService>;

  beforeEach(async () => {
    mockFirmRequestService = createSpyObj('FirmRequestService', [
      'fetchClearingFirmsOfFirm',
      'fetchRequestManagerTemplatesAll',
    ]);
    await TestBed.configureTestingModule({
      declarations: [ItemsInRequestComponent, StaffFormatPipe, SentAttachmentPipe, ReceivedDocumentsPipe],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Window, useValue: window },
        { provide: FirmRequestService, useValue: mockFirmRequestService },
        UiStateService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsInRequestComponent);
    component = fixture.componentInstance;
    component.viewModel$ = of({
      contactsViewModel: { envelopeId: '456' },
      itemsViewModel: {
        items: [{ item: { entityId: 123, envelopeId: '456' } }],
      },
    } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate start date', (done) => {
    //start date is required
    component.visited[0] = {
      startDate: true,
    };
    fixture.detectChanges();
    component.validateStartDate(0, {} as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const dateEle = fixture.debugElement.query(By.css('#startDate'));
      expect(dateEle).toBeNull();
      done();
    });
  });
  it('should show delete item', (done) => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.DRAFT,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const all: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-items"]'));
      const deleteEle: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-delete-item"]'));
      expect(all).toBeTruthy();
      expect(deleteEle).toBeTruthy();
      done();
    });
  });

  it('should call onRemoveSelectedItem', (done) => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.DRAFT,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const deleteEle: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-delete-item"]'));
      spyOn(component, 'onRemoveSelectedItem');
      deleteEle.triggerEventHandler('click', null);
      expect(component.onRemoveSelectedItem).toHaveBeenCalled();
      expect(component.showDeleteConfirmation).toBeFalse();
      done();
    });
  });

  it('should set showDeleteConfirmation to true and open modal', (done) => {
    component.onRemoveSelectedItem(1);
    expect(component.showDeleteConfirmation).toBeTrue();
    expect(component.selectedIndex).toEqual(1);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const deleteEleModal: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-delete-modal"]'));
      expect(deleteEleModal).toBeTruthy();
      done();
    });
  });

  it('should call onRemoveFile', () => {
    const view = {
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        changed: false,
        status: EnvelopeStatus.DRAFT,
        items: [{ item: { entityId: 123, envelopeId: '456', attachments: [{}] } as any, open: true } as any],
      },
    } as any;

    component.onRemoveFile(0, 0, view);
    expect(view.itemsViewModel.changed).toBeTrue();
  });
  // it('should onClearningFirmChange', () => {
  //   const clearingFirm: Firm = { name: 'Clearing Firm 1', id: 123 };
  //   const event = { detail: { text: 'Clearing Firm 1', value: 123 } };
  //   // @ts-ignore
  //   component.items = [{}];
  //   component.clearingFirms = [clearingFirm];
  //   component.onClearningFirmChange(event, 0);
  //   expect(component.items[0].formData).toEqual(JSON.stringify({clearingFirm: { name: 'Clearing Firm 1', id: 123 }}));
  // });

  // it('should fetchClearingFirmsOfFirm', async() => {
  //   const clearingFirm: Firm = { name: 'Clearing Firm 1', id: 123 };
  //   const spy = spyOn(firmRequestService,'fetchClearingFirmsOfFirm').and.returnValue(new Promise((c) => c([clearingFirm])));
  //   await component.fetchClearingFirmsOfFirm(123);
  //   expect(component.clearingFirms).toEqual([clearingFirm]);
  //   expect(spy).toHaveBeenCalledWith(123);
  // });

  it('should have partial submition', (done) => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, partiallySubmitted: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const el: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-partial"]'));
      expect(el).toBeTruthy();
      done();
    });
  });
  it('should have item.partiallySubmitted', (done) => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, partiallySubmitted: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const view: HTMLElement = fixture.debugElement.query(
        By.css('[data-test="ccm-item-partiallySubmitted"]')
      ).nativeElement;
      expect(view.textContent).toEqual('Partial Submission');
      done();
    });
  });
  it('should have d2Flag', (done) => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, d2iFlag: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const el: DebugElement = fixture.debugElement.query(By.css('[data-test="ccm-d2flag"]'));
      expect(el).toBeTruthy();
      done();
    });
  });
  it('should have item.d21', () => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, d2iFlag: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    const view: HTMLElement = fixture.debugElement.query(By.css('[data-test="ccm-item-d2iFlag-span"]')).nativeElement;
    expect(view.textContent).toEqual('D2i');
  });
  it('should have item.cat', () => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, catFlag: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    const view: HTMLElement = fixture.debugElement.query(By.css('[data-test="ccm-item-catFlag"]')).nativeElement;
    expect(view.textContent).toEqual('CAT');
  });
  it('should have item.rci', () => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { entityId: 123, envelopeId: '456' } as any, open: true, rciFlag: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    const view: HTMLElement = fixture.debugElement.query(By.css('[data-test="ccm-item-rciFlag"]')).nativeElement;
    expect(view.textContent).toEqual('RCI');
  });

  it('should set noResponse on item to false', () => {
    const item = { noResponse: true, itemType: ItemType.NON_DATE } as ItemData;
    component.onNoResponseChange(item, {} as any);
    expect(item.noResponse).toBeFalse();
    expect(item.itemType).toEqual(ItemType.AS_OF_DATE);
  });

  it('should set noResponse on item to true and clean AS_OF_DATE', () => {
    const item = { noResponse: false, itemType: ItemType.AS_OF_DATE } as ItemData;
    component.onNoResponseChange(item, {} as any);
    expect(item.noResponse).toBeTrue();
    expect(item.itemType).toEqual(ItemType.NON_DATE);
  });

  it('should set noResponse on item to true', () => {
    const item = { noResponse: false } as ItemData;
    component.onNoResponseChange(item, {} as any);
    expect(item.noResponse).toBeTrue();
  });

  it('should set showSidePanel on toggleItemTypeSelect to true', () => {
    component.showSidePanel = false;
    component.toggleItemTypeSelect();
    expect(component.showSidePanel).toBeTrue();
  });

  it('should have firmComments div', () => {
    component.viewModel$ = of({
      contactsViewModel: { isNew: true },
      itemsViewModel: {
        status: EnvelopeStatus.PUBLISHED,
        items: [{ item: { id: 1, ewsCommentCount: 12 }, open: true } as any],
      } as any,
    } as any);
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('[data-test="ccm-firm-comments"]')).nativeElement;
    expect(el).toBeTruthy();
    const view: HTMLElement = fixture.debugElement.query(By.css('[data-test="ccm-firm-comments-count"]')).nativeElement;
    expect(view.textContent).toEqual('Firm Comments: 12');
  });

  it('should fetch clearing firms of null', () => {
    component
      .getClearingFirms(null)
      .pipe(take(1))
      .subscribe((f) => expect(f).toEqual([]));
  });

  it('should include self-clearing option', () => {
    const firm = new Contacts();
    firm.crdId = '123';
    firm.name = 'test Firm';

    mockFirmRequestService.fetchClearingFirmsOfFirm.and.returnValue(of([]));

    component
      .getClearingFirms(firm)
      .pipe(take(1))
      .subscribe((f) => expect(f.length).toEqual(1));
  });

  it('should not duplicate self-clearing', () => {
    const firm = new Contacts();
    firm.crdId = '123';
    firm.name = 'test Firm';

    mockFirmRequestService.fetchClearingFirmsOfFirm.and.returnValue(of([firm]));

    component
      .getClearingFirms(firm)
      .pipe(take(1))
      .subscribe((f) => expect(f.length).toEqual(1));
  });
});
