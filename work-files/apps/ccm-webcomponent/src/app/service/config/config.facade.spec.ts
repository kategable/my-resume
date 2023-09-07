import { TestBed } from '@angular/core/testing';
import { Subject, takeUntil } from 'rxjs';

import { ConfigFacade } from './config.facade';
import { Config } from './config.interface';

describe('ConfigFacade', () => {
  let service: ConfigFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('config should update', () => {
    let config = new Config();

    const _destroyed$ = new Subject<any>();
    service.config$.pipe(takeUntil(_destroyed$)).subscribe((value: any) => {
      expect(value).toEqual(config);
      _destroyed$.next(true);
    });
    service.updateConfig(config);
  });
  it('should return new config if no keys', () => {
    let config = undefined as any;
    service.updateConfig(config);
    service.config$.subscribe((value: any) => {
      expect(value).toEqual(new Config());
    });
  });
  it('should return config with keys', () => {
    let config = { businessContext: {} } as any;
    service.updateConfig(config);
    service.config$.subscribe((value: any) => {
      expect(value.businessContext).toEqual(config.businessContext);
    });
  });
});
