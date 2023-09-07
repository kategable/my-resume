import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemType } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel, ItemsViewModel } from '../models/envelope-view-model';
import { validateDate } from '../../api/envelope/envelope-helper';
import { Staffs } from '../../service/config/config.interface';
import { UiStateService } from '../../service/ui-state.service';
import { lessThanToday } from '../item-actions-update/custom-validator';
import { bool } from 'aws-sdk/clients/signer';

@Component({
  selector: 'app-items-bulk-update',
  templateUrl: './items-bulk-update.component.html',
  styleUrls: ['./items-bulk-update.component.scss'],
})
export class ItemsBulkUpdateComponent {
  constructor(private readonly uiStateService: UiStateService) {}

  @Input() viewModel: ItemsViewModel = {} as ItemsViewModel;
  @Input() staff: Staffs[] = [];
  @Output() onUpdate = new EventEmitter();
  model = { item: { itemType: ItemType.AS_OF_DATE } } as ItemDataViewModel;
  validateDate = validateDate;
  lessThanToday = lessThanToday;
  visited: { user: boolean; dueDate: boolean; asOfDate: boolean; startDate: boolean; endDate: boolean } = {
    user: false,
    dueDate: false,
    asOfDate: false,
    startDate: false,
    endDate: false,
  };
  AS_OF_DATE = ItemType.AS_OF_DATE;
  DATE_RANGE = ItemType.DATE_RANGE;
  showError = false;
  onChange($event: any, name: 'itemName' | 'itemType' | 'notes') {
    if (!$event.target.value || this.model.item[name] === $event.target.value) {
      return;
    }
    this.model.item[name] = $event.target.value;
  }

  onDateChange($event: any, name: 'startDate' | 'endDate' | 'asOfDate' | 'dueDate') {
    if (!this.viewModel) throw new Error('viewModel is undefined');
    this.model.item[name] = $event.detail;
  }

  validateStartDate() {
    let msg = '';
    const visitedItem = this.visited;
    if (visitedItem) {
      if (visitedItem.startDate && this.model.item.startDate && !this.validateDate(this.model.item.startDate)) {
        msg = 'Provide valid date';
      } else if (
        visitedItem.endDate &&
        this.validateDate(this.model.item.endDate) &&
        new Date(this.model.item.endDate || '') < new Date(this.model.item.startDate || '')
      ) {
        msg = 'Start date should not be after end date';
      }
    }
    return msg;
  }
  validateAsOfDate() {
    let msg = '';
    const visitedItem = this.visited;
    if (visitedItem) {
      if (visitedItem.asOfDate && this.model.item.asOfDate && !this.validateDate(this.model.item.asOfDate)) {
        msg = 'Provide valid date';
      }
    }
    return msg;
  }
  validateDueDate() {
    let msg = '';
    const visitedItem = this.visited;
    if (visitedItem) {
      if (visitedItem.dueDate && this.model.item.dueDate && !this.validateDate(this.model.item.dueDate)) {
        msg = 'Provide valid date';
      }
    }
    return msg;
  }
  validateEndDate() {
    let msg = '';
    const visitedItem = this.visited;
    if (visitedItem) {
      if (visitedItem.endDate && this.model.item.endDate && !this.validateDate(this.model.item.endDate)) {
        msg = 'Provide valid date';
      }
    }
    return msg;
  }
  async onAssignedToChange($event: any) {
    const detail = $event.detail.value;
    if (!detail) {
      return;
    }
    this.model.selectedAssignTo = detail;
  }
  update() {
    if (this.model.item.itemType === this.AS_OF_DATE) {
      this.model.item.startDate = '';
      this.model.item.endDate = '';
    }
    if (this.model.item.itemType === this.DATE_RANGE) {
      this.model.item.asOfDate = '';
    }
    if (this.model.item.itemType === this.AS_OF_DATE && this.validateAsOfDate().length > 0) {
      this.model.item.asOfDate = '';
    }
    if (this.validateDueDate().length > 0) {
      this.model.item.dueDate = '';
    }
    if (this.model.item.itemType === this.DATE_RANGE && this.validateStartDate().length > 0) {
      this.model.item.startDate = '';
    }
    if (this.model.item.itemType === this.DATE_RANGE && this.validateEndDate().length > 0) {
      this.model.item.endDate = '';
    }
    if (!this.hasAllForDateRange()) {
      this.showError = true;
      return;
    }
    this.onUpdate.emit(this.model);
  }

  hasAllForDateRange(): boolean {
    if (this.model.item.itemType === this.DATE_RANGE) {
      if (this.model.item.startDate || this.model.item.endDate) {
        if (!this.model.item.startDate || !this.model.item.endDate) {
          return false;
        }
      }
    }
    return true;
  }
  reset() {
    this.model.selectedAssignTo = null;
    this.model.item.itemType = ItemType.AS_OF_DATE;
    this.model.item.startDate = '';
    this.model.item.endDate = '';
    this.model.item.asOfDate = '';
    this.model.item.dueDate = '';
    this.model.item.notes = '';
  }
}
