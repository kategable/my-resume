// angular
import { Injectable } from '@angular/core';
// libraries
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
// application
import { Config, Contacts } from './config.interface';
import { ConfigFacade } from './config.facade';

@Injectable({
  providedIn: 'root',
})
/* Config Service exposes application observables and methods to 
 the window variable, CorrespondenceMgmt. This allows for applications
 consuming our web components to programatically configure and trigger
 component functionality, and access component data.
 */
export class ConfigService {
  private config: Config = new Config();
  private _destroyed$ = new Subject<boolean>();

  constructor(private window: Window, private configFacade: ConfigFacade) {
    // @ts-ignore
    this.window.CorrespondenceMgmt = this.CorrespondenceMgmt.bind(this);

    this.configFacade.config$.pipe(takeUntil(this._destroyed$)).subscribe((config: Config) => {
      this.config = config;
    });
  }

  ngOnDestroy() {
    this._destroyed$.next(true);
  }

  CorrespondenceMgmt(config?: Config) {
    if (config) {
      this.configFacade.updateConfig(config);
    }

    return {
      config: this.config,
    };
  }
}
