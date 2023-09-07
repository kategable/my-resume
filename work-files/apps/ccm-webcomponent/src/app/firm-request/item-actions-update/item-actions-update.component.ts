import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import UpdateItemSteps from '../enums/update-item-steps';
import { UiStateService } from '../../service/ui-state.service';
import { ActionStatuses } from '../../service/action-statuses-data';
import { FormControl, Validators } from '@angular/forms';
import { PatchRequest } from '../models/patch-request.model';
import { ItemActionType } from '../../api/envelope/enums/item-actions';
import { EnvelopeViewModel, ItemDataViewModel } from '../models/envelope-view-model';
import { CustomValidators } from './custom-validator';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-item-actions-update',
  templateUrl: './item-actions-update.component.html',
  styleUrls: ['./item-actions-update.component.scss'],
})
export class ItemActionsUpdateComponent implements OnChanges {
  selectedAction: ActionStatuses | null = null;
  activeStep: string = UpdateItemSteps.SELECT_ACTION;
  actions$ = this.uiStateService.itemActions$;

  date = new FormControl('');
  note = new FormControl('');
  showConfirmationDialog = false;
  saving = false;
  WITH_DATE = ItemActionType.WITH_DATE;

  constructor(private readonly uiStateService: UiStateService) {}

  item$ = this.uiStateService.selectedItem$;
  @Input() viewModel: EnvelopeViewModel | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedAction = null;
  }

  onActionChange(event: any) {
    this.selectedAction = event.detail.value as ActionStatuses;
    this.date.clearValidators();
    this.note.clearValidators();
    if (this.selectedAction?.itemType === ItemActionType.WITH_DATE) {
      this.date.setValidators([Validators.required, CustomValidators.LessThanToday]);
    }
    if (this.selectedAction?.isReject) {
      this.note.setValidators([Validators.required]);
    }
  }
  update(itemModel: ItemDataViewModel) {
    if (!this.selectedAction) return;
    if (this.selectedAction.confirmModal) {
      this.showConfirmationDialog = true;
      return;
    }
    this.accept(itemModel);
  }
  accept(itemModel: ItemDataViewModel) {
    this.saving = true;
    this.showConfirmationDialog = false;
    this.updateItem(itemModel);
  }
  cancel() {
    this.showConfirmationDialog = false;
  }
  async updateItem(itemModel: ItemDataViewModel) {
    const patch = {
      viewModel: this.viewModel,
      itemModel: itemModel,
      action: this.selectedAction,
      note: this.note.value,
      date: this.date.value,
    } as PatchRequest;
    const updatedModel = await firstValueFrom(this.uiStateService.updateItemAction(patch));
    this.saving = false;
    if (updatedModel === null) {
      this.uiStateService.showRedAlert(`Item wasn't updated`);
      return;
    }

    this.uiStateService.showGreenAlert(`Item ${itemModel.item.itemName} was updated`);
    this.selectedAction = null;
    this.note.setValue('');
  }
  getError(errors: any) {
    if (errors?.['required']) return 'Required';
    if (errors?.['lessThanToday']) return 'Only after today';
    return null;
  }
}
