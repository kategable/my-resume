import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, debounceTime, filter, map, switchMap } from 'rxjs';
import { COMPONENT_DEBOUNCE_TIME_MILLIS } from '../../../common/constants/envelope.constants';
import { mapList } from '../../../common/converters/mappers';
import { staffInternalContactMapper } from '../../../common/converters/staff-InternalContact.mapper';
import { Staffs } from '../../../service/config/config.interface';
import { FirmRequestService, InternalContact } from '../../service/firm-request.service';

@Component({
  selector: 'app-additional-contact-dialog',
  templateUrl: './additional-contact-dialog.component.html',
  styleUrls: ['./additional-contact-dialog.component.scss'],
})
export class AdditionalContactDialogComponent implements OnInit {
  selectedIntContacts: Staffs[] = [];

  selectedResultText: string = '';
  internalContactsInFocus: boolean = false;

  @Output() onClose = new EventEmitter();
  @Output() onAddContacts = new EventEmitter<Staffs[]>();

  constructor(private firmRequestService: FirmRequestService) {}
  ngOnInit(): void {
    this.selectedIntContacts = [];
  }
  searchSubject = new BehaviorSubject<string>('');

  searchResults$ = this.searchSubject.pipe(
    debounceTime(COMPONENT_DEBOUNCE_TIME_MILLIS),
    filter((query: string) => this.filterQuery(query)),
    switchMap((query: string) => this.firmRequestService.fetchInternalContacts(query)),
    map((results: InternalContact[]) => mapList(staffInternalContactMapper)(results))
  );

  search($event: any) {
    if ($event?.detail?.event?.keyCode === 13) {
      return;
    }
    if (!$event || !$event.detail) {
      return;
    }

    this.searchSubject.next($event.detail.value || '');
  }

  handleResultClick(selected: Staffs) {
    if (this.selectedIntContacts.find((contact: Staffs) => contact.email === selected.email)) {
      return;
    }
    this.selectedIntContacts.push(selected);
  }

  onFocus($event: any) {
    this.search($event);
    this.internalContactsInFocus = true;
  }

  onInternalContactBlur() {
    setTimeout(() => {
      this.internalContactsInFocus = false;
    }, 1000);
  }

  addSelectedContacts() {
    this.onAddContacts.emit(this.selectedIntContacts);
  }

  onRemoveSelectedIntContact(index: number) {
    this.selectedIntContacts.splice(index, 1);
  }

  onCloseDialog() {
    this.selectedIntContacts = [];
    this.selectedResultText = '';
    this.onClose.emit();
  }
  private filterQuery(query: string): boolean {
    {
      if (typeof query !== 'string') {
        return false;
      }
      if (!query || query === '') {
        return false;
      }
      return true;
    }
  }
}
