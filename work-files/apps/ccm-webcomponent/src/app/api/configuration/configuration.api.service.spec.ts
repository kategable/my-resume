import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigurationApiService } from './configuration.api.service';
import { BusinessContext, ContentStorage, DeliveryChannel } from './configuration.api.interface';
import { ApiHostService } from '../../service/api.host.service';
import { firstValueFrom, lastValueFrom, of, throwError, throwIfEmpty } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('ConfigurationApiService', () => {
  let service: ConfigurationApiService;
  let hostService: SpyObj<ApiHostService>;
  let httpSpy: SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj(HttpClient, ['get']);
    hostService = jasmine.createSpyObj(ApiHostService, ['baseUrl']);
    service = new ConfigurationApiService(httpSpy, hostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getBusinessContext', async () => {
    const code = 'CASE';
    const response = new BusinessContext();
    httpSpy.get.and.returnValue(of(response));

    const result = await firstValueFrom(service.getBusinessContext(code));
    expect(result).toEqual(response);
    expect(httpSpy.get).toHaveBeenCalledWith(
      `${hostService.baseUrl}/outbox-api/configuration/busines-context/${code}`,
      { withCredentials: true }
    );
  });

  it('getContentStorage', async () => {
    const code = 'CASE';
    const response = new ContentStorage();
    httpSpy.get.and.returnValue(of(response));

    const result = await firstValueFrom(service.getContentStorage(code));
    expect(result).toEqual(response);
    expect(httpSpy.get).toHaveBeenCalledWith(
      `${hostService.baseUrl}/outbox-api/configuration/content-storage/${code}`,
      { withCredentials: true }
    );
  });

  it('getDeliveryChannel', async () => {
    const code = 'CASE';
    const response = new DeliveryChannel();
    httpSpy.get.and.returnValue(of(response));

    const result = await firstValueFrom(service.getDeliveryChannel(code));
    expect(result).toEqual(response);
    expect(httpSpy.get).toHaveBeenCalledWith(
      `${hostService.baseUrl}/outbox-api/configuration/delivery-channel/${code}`,
      { withCredentials: true }
    );
  });
  it('getConfigurationByGroup', async () => {
    httpSpy.get.and.returnValue(of(null));
    const group = 'test-group';
    const response = await lastValueFrom(service.getConfigurationByGroup(group));
    const expectedUrl = `${hostService.baseUrl}/outbox-api/configuration?group=${group}`;
    expect(response).toEqual(null);
    expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl, {
      withCredentials: true,
    });
  });
  it('getConfigurationByGroup with error', async () => {
    httpSpy.get.and.callFake(() => {
      return throwError(() => new Error('Fake error'));
    });
    const group = 'test-group';
    try {
      const response = await lastValueFrom(service.getConfigurationByGroup(group));
    } catch (error) {
      expect(error).toEqual(new Error('Fake error'));
    }
  });
  it('getConfiguration with error', async () => {
    httpSpy.get.and.callFake(() => {
      return throwError(() => new Error('Fake error'));
    });
    try {
      const response = await lastValueFrom(service.getConfiguration());
    } catch (error) {
      expect(error).toEqual(new Error('Fake error'));
    }
  });
});
