import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { UiStateService } from '../../service/ui-state.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    service = new AlertService({} as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
