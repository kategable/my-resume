import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transfer-confirmation',
  templateUrl: './transfer-confirmation.component.html',
  styleUrls: ['./transfer-confirmation.component.scss'],
})
export class TransferConfirmationComponent {
  @Output() cancel = new EventEmitter();
  @Output() ok = new EventEmitter();
}
