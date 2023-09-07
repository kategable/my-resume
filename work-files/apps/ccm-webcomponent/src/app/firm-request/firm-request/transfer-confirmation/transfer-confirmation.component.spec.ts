import { ComponentFixture } from '@angular/core/testing';
import { TransferConfirmationComponent } from './transfer-confirmation.component';

describe('TransferConfirmationComponent', () => {
  let component: TransferConfirmationComponent;
  let fixture: ComponentFixture<TransferConfirmationComponent>;

  beforeEach(async () => {
    component = new TransferConfirmationComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
