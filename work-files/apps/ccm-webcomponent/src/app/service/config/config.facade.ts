/*
  The intent of the Façade is to provide a high-level interface (state, properties and methods)
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Config } from './config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigFacade {
  private readonly configSubject: BehaviorSubject<Config> = new BehaviorSubject(new Config());
  public config$ = this.configSubject.asObservable();
  private config: Config = new Config();

  constructor() {}

  public updateConfig(config: any) {
    let newObj: any = {};
    for (let prop in config) {
      const val = config[prop];
      if (val !== undefined) {
        newObj[prop] = val;
      }
    }
    if (Object.keys(newObj).length < 1) return;
    this.config = { ...this.config, ...newObj };
    this.configSubject.next(this.config);
  }
}
