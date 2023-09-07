import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { ApiHostService } from '../../service/api.host.service';

import { FirmRequestService } from './firm-request.service';
import { Contacts } from '../../service/config/config.interface';

describe('FirmRequestService', () => {
  let service: FirmRequestService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let apiHostService: ApiHostService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    apiHostService = new ApiHostService(window.document);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = new FirmRequestService(httpClientSpy, apiHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetchClearingFirmsOfFirm', async () => {
    const clearingFirm: Contacts = new Contacts();
    const spy = spyOn(service, 'fetchClearingFirmsOfFirm').and.returnValue(of([clearingFirm]));
    service.fetchClearingFirmsOfFirm(123).subscribe((response: Contacts[]) => {
      expect(response).toEqual([clearingFirm]);
    });
    expect(spy).toHaveBeenCalledWith(123);
  });
  it('should call fetchRequestManagerItemsForRequestTemplateId and return data', async () => {
    const url = `/outbox-api/request-manager-templates/item-templates?requestTemplateId=1`;
    const data = { list: [{ id: 1, name: 'test' }] } as any;
    httpClientSpy.get.and.returnValue(of(data));
    const response = await firstValueFrom(service.fetchRequestManagerItemsForRequestTemplateId('1'));
    expect(response).toEqual(data.list);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url, { withCredentials: true });
  });

  it('should call fetchRequestManagerItemsNoRequestTemplateId and return data', async () => {
    const data = { list: [{ id: 1, name: 'test' }] } as any;
    const url = `/outbox-api/request-manager-templates/item-templates`;
    httpClientSpy.get.and.returnValue(of(data));
    const response = await firstValueFrom(service.fetchRequestManagerItemsNoRequestTemplateId());
    expect(response).toEqual(data.list);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url, { withCredentials: true });
  });
  it('should call fetchRequestManagerTemplates and return data', async () => {
    const data = [{ id: 1, name: 'test' }] as any;
    const url = `/outbox-api/request-manager-templates?tag=,test`;
    httpClientSpy.get.and.returnValue(of(data));
    const response = await service.fetchRequestManagerTemplates([{ name: 'test' }]);
    expect(response).toEqual(data);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url, { withCredentials: true });
  });
  it('should call fetchRequestManagerTemplatesForCaseId and return data', async () => {
    const data = { list: [{ id: 1, name: 'test' }] } as any;
    const url = `/outbox-api/request-manager-templates/request-templates?showRelevant=true&caseId=1`;
    httpClientSpy.get.and.returnValue(of(data));
    const response = await firstValueFrom(service.fetchRequestManagerTemplatesForCaseId(1));
    expect(response).toEqual(data.list);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url, { withCredentials: true });
  });
  it('should call fetchRequestManagerTemplatesAll and return data', async () => {
    const data = { list: [{ id: 1, name: 'test' }] } as any;
    const url = `/outbox-api/request-manager-templates/request-templates`;
    httpClientSpy.get.and.returnValue(of(data));
    const response = await firstValueFrom(service.fetchRequestManagerTemplatesAll());
    expect(response).toEqual(data.list);
    expect(httpClientSpy.get).toHaveBeenCalledWith(url, { withCredentials: true });
  });
  it('should call fetchRequestManagerItemsForRequestTemplateId without ids and throw error', async () => {
    try {
      await firstValueFrom(service.fetchRequestManagerItemsForRequestTemplateId(undefined));
    } catch (error: any) {
      expect(error.message).toEqual('requestTemplateId is undefined or null');
    }
  });
});
