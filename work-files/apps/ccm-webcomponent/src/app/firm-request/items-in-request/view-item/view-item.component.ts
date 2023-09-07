import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemDataViewModel } from '../../models/envelope-view-model';
import EnvelopeStatus from '../../enums/envelope-status';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewitemComponent {
  @Input() model: ItemDataViewModel | undefined;
  @Input() isSelected: boolean = false;
  @Input() showSelect: boolean = false;
  @Output() onItemSelect = new EventEmitter();
  @Output() onToggleOpen = new EventEmitter();
  @Output() onItemChecked = new EventEmitter();

  DRAFT = EnvelopeStatus.DRAFT;
}
