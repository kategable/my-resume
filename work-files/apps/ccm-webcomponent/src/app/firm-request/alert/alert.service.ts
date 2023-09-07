import { Injectable } from '@angular/core';
import { UiStateService } from '../../service/ui-state.service';

export interface Alert {
  message?: string;
  show: boolean;
  type?: 'success' | 'error' | 'info' | 'warning';
  withClose?: boolean;
  withAction?: boolean;
  action?: string;
  onClose?: { (): void };
  onCloseThis?: Object;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private readonly uiStateService: UiStateService) {}

  alert$ = this.uiStateService.alert$;
  showSuccess(message: string) {
    this.uiStateService.showGreenAlert(message);
  }

  showError(message: string) {
    this.uiStateService.showRedAlert(message);
  }

  onActionClicked() {
    //TODO: use if you need to execute an action , like an auothenticate redirect
    throw new Error('Method not implemented.');
  }
  onClosedClicked() {
    this.uiStateService.hideAlert();
  }
}
