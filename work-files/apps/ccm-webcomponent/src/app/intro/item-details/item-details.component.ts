import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { formatItemDates } from '../../api/envelope/envelope-helper';

@Component({
  selector: 'app-detail-cell-renderer',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsCellRenderer implements ICellRendererAngularComp {
  items!: any;
  showNoItemsMessage: boolean = false;

  // called on init
  agInit(params: any): void {
    this.items = params.data.rm_items = params.data?.rm_items?.length > 0 ? params.data.rm_items : null;
    this.showNoItemsMessage = !this.items;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return false;
  }

  formatItemDate(itemDate: string | number | null | undefined): string {
    return itemDate ? formatItemDates('' + itemDate) : '';
  }
}
