import { Component } from '@angular/core';
import { UiStateService } from '../../../service/ui-state.service';

@Component({
  selector: 'app-item-actions-activities',
  templateUrl: './item-actions-activities.component.html',
  styleUrls: ['./item-actions-activities.component.scss'],
})
export class ItemActionsActivitiesComponent {
  constructor(private readonly uiStateService: UiStateService) {}
  events$ = this.uiStateService.selectedItemEvents$;
}
