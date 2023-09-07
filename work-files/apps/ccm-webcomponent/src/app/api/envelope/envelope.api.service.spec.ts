import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EnvelopeService } from './envelope.api.service';
import { Envelope } from './envelope.api.interface';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiHostService } from '../../service/api.host.service';
import { PatchData } from '../../firm-request/models/patch-request.model';
import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { ItemAction, ItemActionRequest } from '../../firm-request/models/item-action-request.model';

describe('EnvelopeService', () => {
  let service: EnvelopeService;
  let hostService: ApiHostService;
  let httpSpy: SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj(HttpClient, ['patch', 'get', 'delete', 'put', 'post']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(EnvelopeService);
    hostService = TestBed.inject(ApiHostService);

    //httpSpy.post.and.returnValue(of([]));
    // httpSpy.put.and.returnValue(of({}));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should accept sample payload as Envelope type', () => {
    // const payload = testRmEnvelope as Envelope;
  });

  it('search', async () => {
    const query = {};
    const response: Envelope[] = [];
    const expectedUrl = '/search-api/envelopes';
    httpSpy.post.and.returnValue(of(response));

    const values = await lastValueFrom(service.search(query));
    expect(values).toEqual(response);
    expect(httpSpy.post).toHaveBeenCalledWith(expectedUrl, query, {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });

  it('save', async () => {
    const response: Envelope = {
      envelopeId: '1234',
    } as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes/1234`;
    httpSpy.put.and.returnValue(of(response));
    const values = await service.save(response);

    expect(values).toEqual(response);
    expect(httpSpy.put).toHaveBeenCalledWith(expectedUrl, JSON.stringify(response), {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
  it('save new', async () => {
    const response: Envelope = {} as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes`;
    httpSpy.post.and.returnValue(of(response));
    const values = await service.save(response);
    expect(values).toEqual(response);
    expect(httpSpy.post).toHaveBeenCalledWith(expectedUrl, response, {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
  describe('patch call tests', () => {
    let envelope = { envelopeId: '123-id' } as any;
    let patchData = {} as PatchData;
    let itemId = 1234;

    it('should call correct url for path call', async () => {
      httpSpy.patch.and.returnValue(of({}));
      const result = await lastValueFrom(service.patch(envelope.envelopeId, 'ITEM', itemId, patchData));
      const expectedUrl = '/outbox-api/envelopes/internal/123-id/ITEM/1234';
      expect({} as any).toEqual(result);
      expect(httpSpy.patch).toHaveBeenCalledWith(expectedUrl, JSON.stringify(patchData), {
        responseType: 'json',
        withCredentials: true,
        headers: EnvelopeService.HEADERS_JSON,
      });
    });
  });

  describe('post call for AOS', () => {
    const envelope = { envelopeId: '123-id' } as any;
    const request = [{ itemId: 1234, comments: 'test' }] as ItemActionRequest[];

    it('should call correct url for post call', async () => {
      httpSpy.put.and.returnValue(of({}));

      const result = await lastValueFrom(
        service.updateAction(envelope.envelopeId, request, ItemAction[ItemAction.aos])
      );
      const expectedUrl = '/outbox-api/envelopes/123-id/items/action/aos';
      expect({} as any).toEqual(result);
      expect(httpSpy.put).toHaveBeenCalledWith(expectedUrl, JSON.stringify(request), {
        responseType: 'json',
        withCredentials: true,
        headers: EnvelopeService.HEADERS_JSON,
      });
    });
  });
  it('should call a correct url for find', async () => {
    const response: Envelope = {} as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes/1234`;
    httpSpy.get.and.returnValue(of(response));
    const values = await firstValueFrom(service.find('1234'));
    expect(values).toEqual(response);
    expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl, {
      responseType: 'json',
      withCredentials: true,
    });
  });
  it('shoudl call a correct url for delete', async () => {
    const response: Envelope = {} as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes/1234`;
    httpSpy.delete.and.returnValue(of(response));
    await service.delete('1234');
    expect(httpSpy.delete).toHaveBeenCalledWith(expectedUrl, {
      responseType: 'json',
      withCredentials: true,
    });
  });
  it('should call a correct url for publish', async () => {
    const response: Envelope = {} as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes/1234/publish`;
    httpSpy.put.and.returnValue(of(response));
    const values = await service.publish({ envelopeId: '1234' } as any);
    expect(values).toEqual(response);
    expect(httpSpy.put).toHaveBeenCalledWith(expectedUrl, JSON.stringify({ envelopeId: '1234' }), {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
  it('should call a correct url for publish no envelope id', async () => {
    const response: Envelope = {} as any;
    const expectedUrl = `${hostService.baseUrl}/outbox-api/envelopes/publish`;
    httpSpy.post.and.returnValue(of(response));
    const values = await service.publish({ envelopeId: null } as any);
    expect(values).toEqual(response);
    expect(httpSpy.post).toHaveBeenCalledWith(expectedUrl, JSON.stringify({ envelopeId: null }), {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
  it('should call a correct url for getAccessLevel', async () => {
    const response = ['test'];
    const expectedUrl = `/sentry-api/policy/1234/user-rights`;
    httpSpy.get.and.returnValue(of(response));
    const values = await firstValueFrom(service.getAccessLevel('1234'));
    expect(values).toEqual(response);
    expect(httpSpy.get).toHaveBeenCalledWith(expectedUrl, {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
  it('should call a correct url for publishChanges', async () => {
    const response = ['test'];
    const expectedUrl = `/outbox-api/envelopes/1234/contacts`;
    httpSpy.put.and.returnValue(of(response));
    const data = { test: 'asdasd' } as any;
    const values = await service.publishChanges('1234', data);
    expect(values).toEqual(response);
    expect(httpSpy.put).toHaveBeenCalledWith(expectedUrl, JSON.stringify(data), {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  });
});
