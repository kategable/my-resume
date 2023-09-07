import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EMAIL_REGEX } from '../contacts.component';
import { Contacts } from '../../../service/config/config.interface';

@Component({
  selector: 'app-additional-recipient-dialog',
  templateUrl: './additional-recipient-dialog.component.html',
  styleUrls: ['./additional-recipient-dialog.component.scss'],
})
export class AdditionalRecipientDialogComponent implements OnInit {
  constructor(private readonly formBuilder: FormBuilder) {}

  @Output() onClose = new EventEmitter();
  @Output() onAddContact = new EventEmitter<Contacts>();

  contactForm: FormGroup = new FormGroup({});

  showAddNewContactDialog = true;
  FirstControl = new FormControl('', Validators.required);
  LastControl = new FormControl('', Validators.required);
  EmailControl = new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]);

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      FirstControl: this.FirstControl,
      LastControl: this.LastControl,
      EmailControl: this.EmailControl,
    });
  }

  close() {
    this.onClose.emit();
  }

  addContact() {
    if (this.contactForm.invalid) return;
    const contact: Contacts = new Contacts();
    contact.crdId = '';
    contact.name = `${this.FirstControl.value} ${this.LastControl.value}`;
    contact.businessEmail = [this.EmailControl.value || ''];

    this.onAddContact.emit(contact);
  }

  onChange($event: any, control: FormControl) {
    control.setValue($event.target.value);
  }

  isChanged() {
    return this.contactForm.dirty || this.contactForm.touched;
  }
}
