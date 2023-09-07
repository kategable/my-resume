import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ApiHostService } from './api.host.service';

describe('ApiHostService', () => {
  let service: ApiHostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHostService);
  });

  function configure(mockDocument: any) {
    service = new ApiHostService(mockDocument);
  }

  it('should be created', () => {
    const mockDocument = { currentScript: { getAttribute: () => 'https://some.host/web-components/script.js' } } as any;
    const mockWindow = {
      location: { hostname: 'docgen-devint.ccm.dev.finra.org', origin: 'http://docgen-devint.ccm.dev.finra.org' },
    } as any;
    mockDocument.defaultView = mockWindow;
    configure(mockDocument);
    expect(service).toBeTruthy();
  });

  it('should return dev host', () => {
    expect(ApiHostService.getEnv('enterprise.rcm.dev.finra.org')).toEqual('dev');
  });

  it('should return devint host', () => {
    expect(ApiHostService.getEnv('conduct-aws.exam.dev.finra.org')).toEqual('devint');
    expect(ApiHostService.getEnv('enterprise-devint.rcm.dev.finra.org')).toEqual('devint');
    expect(ApiHostService.getEnv('conduct-int-aws.exam.dev.finra.org')).toEqual('devint');
  });

  it('should return qa host', () => {
    expect(ApiHostService.getEnv('enterprise.rcm.qa.finra.org')).toEqual('qa');
    expect(ApiHostService.getEnv('conduct-aws.exam.qa.finra.org')).toEqual('qa');
  });

  it('should return prod host', () => {
    expect(ApiHostService.getEnv('enterprise.rcm.finra.org')).toEqual('prod');
    expect(ApiHostService.getEnv('conduct-aws.exam.finra.org')).toEqual('prod');
  });

  it('should return local host', () => {
    expect(ApiHostService.getEnv('local.dev.finra.org')).toEqual('local');
    expect(ApiHostService.getEnv('localhost')).toEqual('local');
  });

  it('getAlfWcHost', () => {
    const mockDocument = { currentScript: { getAttribute: () => 'https://some.host/web-components/script.js' } } as any;
    const mockWindow = {
      location: { hostname: 'docgen-devint.ccm.dev.finra.org', origin: 'http://docgen-devint.ccm.dev.finra.org' },
    } as any;
    mockDocument.defaultView = mockWindow;
    configure(mockDocument);
    expect(service.alfWcHost).toBe('https://alf00-web-component-devint.alfresco.dev.finra.org');
  });
});
