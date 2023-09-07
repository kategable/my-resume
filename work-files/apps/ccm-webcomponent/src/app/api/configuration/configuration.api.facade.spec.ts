import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';

import { ConfigurationApiFacade } from './configuration.api.facade';
import { BusinessContext, ContentStorage, DeliveryChannel } from './configuration.api.interface';
import { ConfigurationApiService } from './configuration.api.service';

describe('ConfigurationApiFacade', () => {
  let service: ConfigurationApiFacade;
  let api: ConfigurationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });
    service = TestBed.inject(ConfigurationApiFacade);
    api = TestBed.inject(ConfigurationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateBusinessContext', () => {
    const context = new BusinessContext();
    service.updateBusinessContext(context);
    service.businessContext$.subscribe((r: any) => {
      expect(r).toEqual({});
    });
  });

  it('getBusinessContext', () => {
    const response = new BusinessContext();
    const spy = spyOn(service, 'updateBusinessContext');
    spyOn(api, 'getBusinessContext').and.returnValue(new BehaviorSubject(response));
    service.getBusinessContext('CASE').subscribe((r) => {
      expect(r).toEqual(response);
      expect(spy).toHaveBeenCalledWith(response);
    });
  });

  it('getContentStorage', () => {
    const response = new ContentStorage();
    const spy = spyOn(service, 'updateBusinessContext');
    spyOn(api, 'getContentStorage').and.returnValue(new BehaviorSubject(response));
    service.getContentStorage('CASE').subscribe((r) => {
      expect(r).toEqual(response);
      expect(spy).toHaveBeenCalledWith(response);
    });
  });

  it('getDeliveryChannel', () => {
    const response = new DeliveryChannel();
    const spy = spyOn(service, 'updateBusinessContext');
    spyOn(api, 'getDeliveryChannel').and.returnValue(new BehaviorSubject(response));
    service.getDeliveryChannel('CASE').subscribe((r) => {
      expect(r).toEqual(response);
      expect(spy).toHaveBeenCalledWith(response);
    });
  });
});
