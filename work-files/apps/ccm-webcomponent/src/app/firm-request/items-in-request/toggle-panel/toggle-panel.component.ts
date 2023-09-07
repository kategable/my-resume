import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-panel',
  templateUrl: './toggle-panel.component.html',
  styleUrls: ['./toggle-panel.component.scss'],
})
export class TogglePanelComponent {
  @Input() showSidePanel: boolean = false;
  @Output() onShowPanelChange = new EventEmitter();
  toggleItemTypeSelect() {
    this.onShowPanelChange.emit();
  }
}
