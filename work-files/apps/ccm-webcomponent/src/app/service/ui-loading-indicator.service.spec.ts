import { UiLoadingIndicatorService } from './ui-loading-indicator.service';

describe('UiLoadingIndicatorService', () => {
  let service: UiLoadingIndicatorService;

  beforeEach(() => {
    service = new UiLoadingIndicatorService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
