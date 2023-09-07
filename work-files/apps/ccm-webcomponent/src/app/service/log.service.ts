import { Injectable } from '@angular/core';

export enum LogLevel {
  FATAL = 0,
  ERROR = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

let logFunc = console.log;
let logLevel = LogLevel.INFO;

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor() {}
  public setLogLevel(level: LogLevel) {
    logLevel = level;
  }

  public setLogFunc(logFun: any) {
    logFunc = logFun;
  }

  public trace(...args: any[]): void {
    if (logLevel >= LogLevel.TRACE) logFunc(...args);
  }
  public debug(...args: any[]): void {
    if (logLevel >= LogLevel.DEBUG) logFunc(...args);
  }
  public info(...args: any[]): void {
    if (logLevel >= LogLevel.INFO) logFunc(...args);
  }
  public error(...args: any[]): void {
    if (logLevel >= LogLevel.ERROR) logFunc(...args);
  }
  public fatal(...args: any[]): void {
    if (logLevel >= LogLevel.FATAL) logFunc(...args);
  }
}
