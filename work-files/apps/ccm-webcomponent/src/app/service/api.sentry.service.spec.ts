import { Actor, ApiSentryService } from './api.sentry.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ApiHostService } from './api.host.service';
import { Observable, of, throwError } from 'rxjs';

describe('ApiSentryService', () => {
  let service: ApiSentryService;
  let mockHttp: jasmine.SpyObj<HttpClient>;
  let mockApiHostService: jasmine.SpyObj<ApiHostService>;
  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    mockApiHostService = jasmine.createSpyObj('ApiHostService', ['baseUrl']);

    service = new ApiSentryService(mockHttp, mockApiHostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const dummyActor: Actor = {
    username: 'test',
    client: {
      ags: 'test',
      amgGroup: 'test',
      createdBy: 'test',
      id: 1,
      isActive: true,
      name: 'test',
    },
  };

  const dummyActorHttpResponse = new HttpResponse<Actor>({
    body: dummyActor,
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
    status: 200,
    statusText: 'OK',
    url: '',
  });

  it('getOrRegisterActor should retrieve registered actor', (done) => {
    mockHttp.get.and.returnValue(of(dummyActor));
    service.getOrRegisterActor().subscribe((actor) => {
      expect(actor).toEqual(dummyActor);
      done();
    });
  });

  it('getOrRegisterActor should register new actor and retrieve it', () => {
    mockHttp.get.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 404 })),
      of(dummyActor)
    );
    mockHttp.post.and.returnValues(of({ value: 'Account registered successfully' }));
    service.getOrRegisterActor().subscribe((actor) => {
      expect(actor).toEqual(dummyActor);
    });
  });

  it('getOrRegisterActor should fail when register fails', () => {
    mockHttp.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    mockHttp.post.and.returnValues(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            statusText: JSON.stringify({
              message: 'Multiple linkable clients detected for actor. Please explicitly specify a client to link with.',
            }),
          })
      )
    );
    service.getOrRegisterActor().subscribe({
      error: (err) => {},
      complete: () => fail(),
    });
  });

  it('getActor Ok for registered actor', (done) => {
    mockHttp.get.and.returnValue(of(dummyActor));
    service.getActor().then((actor) => {
      expect(actor).toEqual(dummyActor);
      done();
    });
  });

  it('getActor Ok to regisiter for unregistered actor', () => {
    mockHttp.get.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 404 })), // 1st get - no actor
      of(dummyActor) // 2nd get - here we go
    );
    mockHttp.post.and.returnValues(of({ value: 'Account registered successfully' }));
    service.getActor().then((actor) => {
      expect(actor).toEqual(dummyActor);
    });
  });

  it('getActor fail to register', () => {
    mockHttp.get.and.returnValues(
      throwError(() => new HttpErrorResponse({ status: 404 })),
      of(dummyActor)
    );
    const errMessage = 'Multiple linkable clients detected for actor. Please explicitly specify a client to link with.';
    const statusText = JSON.stringify({ message: errMessage });
    mockHttp.post.and.returnValues(throwError(() => new HttpErrorResponse({ status: 400, statusText: statusText })));

    service
      .getActor()
      .then(() => fail('getActor: no error when register failed'))
      .catch((err) => expect(err.message).toEqual(errMessage));
  });

  it('fetchAccessPolicyId should return an Observable<string>', () => {
    const dummyString: string = 'test';
    mockHttp.get.and.returnValue(of([dummyString]));
    service.fetchAccessPolicyId('test').subscribe((string) => {
      expect(string).toEqual(dummyString);
    });
  });

  it('fetchAccessPolicyId should return an Observable<string> when error is 500', () => {
    const dummyString: string = '';
    mockHttp.get.and.returnValue(throwError(new HttpErrorResponse({ status: 500 })));
    service.fetchAccessPolicyId('test').subscribe((string) => {
      expect(string).toEqual(dummyString);
    });
  });
});
