import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import ItemTemplate from '../models/item-template';
import { UiStateService } from '../../service/ui-state.service';
import { ItemTemplateApi } from '../../api/envelope/template.api.interface';

@Component({
  selector: 'app-request-type',
  templateUrl: './request-type.component.html',
  styleUrls: ['./request-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestTypeComponent implements OnInit, AfterViewInit {
  @Output() onSelect = new EventEmitter<ItemTemplateApi>();

  selectedCriteria = 'recommended';
  itemTemplate: ItemTemplateApi | null = null;

  selectedResultText: any = '';
  searchTerm: string = '';

  searchSubject = new BehaviorSubject<string>('');
  searchResults$ = combineLatest([this.searchSubject, this.uiStateService.itemsForRequest$]).pipe(
    map(([searchTerm, data]) => {
      const templates: ItemTemplateApi[] = this.selectedCriteria === 'recommended' ? data.recommended : data.all;
      if (!searchTerm) {
        return templates;
      }
      return templates.filter((t: any) => t.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0);
    })
  );

  loading$ = this.uiStateService.loadingItemsForRequest$;

  constructor(private readonly uiStateService: UiStateService) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.selectedCriteria = 'recommended';
  }

  onTemplateChange($event: any) {
    if (!$event.detail.value) {
      this.searchTerm = '';
      this.selectedResultText = '';
      this.search($event);
    }
  }

  onCriteriaChange($event: any) {
    this.selectedCriteria = $event.target.value;
    this.searchTerm = '';
    this.searchSubject.next(this.searchTerm);
  }

  addItem() {
    if (this.itemTemplate) {
      this.onSelect.emit(this.itemTemplate);
    }
  }

  search($event: any) {
    if ($event?.detail?.event?.keyCode === 13) {
      return;
    }
    if (!$event || !$event.detail) {
      return;
    }

    this.itemTemplate = null;
    this.searchTerm = $event.detail.value || null;
    this.searchSubject.next(this.searchTerm);
  }

  keydownHandler($event: any) {}

  handleResultClick(selected: ItemTemplateApi) {
    this.itemTemplate = selected;
    this.selectedResultText = selected.name;
    this.searchTerm = selected.name;
    this.searchSubject.next(this.searchTerm);
  }

  onFocus($event: any) {
    this.search($event);
  }

  onBlur($event: any) {}

  isD2i(itemTemplateApi: ItemTemplateApi): boolean {
    return ItemTemplateApi.isD2i(itemTemplateApi);
  }
}
