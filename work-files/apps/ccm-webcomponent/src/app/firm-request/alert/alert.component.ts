import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertService } from './alert.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  constructor(private readonly alertService: AlertService) {}
  alert$ = this.alertService.alert$.pipe(
    tap((alert) => {
      if (!alert) return;
      if (alert.show && !alert.withClose) {
        setTimeout(() => this.onCloseToast(), 10000);
      }
    })
  );

  onCloseToast(thisPar?: Object, closeFunction?: { (): void }) {
    this.alertService.onClosedClicked();
    closeFunction?.call(thisPar);
  }

  onAction() {
    this.alertService.onActionClicked();
  }
}
