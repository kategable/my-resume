import { TestBed } from '@angular/core/testing';

import { LogLevel, LogService } from './log.service';

let beenCalled = false;
function logFunc() {
  beenCalled = true;
}

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogService);
    service.setLogFunc(logFunc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function isLogged(logF: any): boolean {
    beenCalled = false;
    logF('test');
    return beenCalled;
  }

  it('should respect log level', () => {
    const msg = 'test';
    for (let setLevel of [LogLevel.FATAL, LogLevel.ERROR, LogLevel.INFO, LogLevel.DEBUG, LogLevel.TRACE]) {
      service.setLogLevel(setLevel);

      expect(isLogged(service.fatal)).toEqual(Number(setLevel) >= LogLevel.FATAL);
      expect(isLogged(service.error)).toEqual(Number(setLevel) >= LogLevel.ERROR);
      expect(isLogged(service.info)).toEqual(Number(setLevel) >= LogLevel.INFO);
      expect(isLogged(service.debug)).toEqual(Number(setLevel) >= LogLevel.DEBUG);
      expect(isLogged(service.trace)).toEqual(Number(setLevel) >= LogLevel.TRACE);
    }
  });
});
