import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export declare type StringMap = {
  [key: string]: string;
};

export declare type StringArrayMap = {
  [key: string]: string[];
};

@Injectable({
  providedIn: 'root',
})
export class ApiHostService {
  private _env: string;
  private _baseUrl: string;
  private _espBaseUrl: string;
  private _alfWcHostBaseUrl: string;

  static hosts: StringMap = {
    local: '', // all 'local' will go through angular localhost proxy (see proxy.config.js)
    dev: 'https://docgen-dev.ccm.dev.finra.org',
    devint: 'https://docgen-devint.ccm.dev.finra.org',
    qa: 'https://docgen-qa.ccm.qa.finra.org',
    qaint: 'https://docgen-qaint.ccm.qa.finra.org',
    prod: 'https://docgen.ccm.finra.org',
  };

  static espHosts: StringMap = {
    local: '/doppler-lookup/api/v1/lookup',
    // ESP dev is unstable. Swicthed our dev/devint to ESP QA. Temporarily?
    //dev: 'https://esp.dev.finra.org/esp-lookup/rest',
    //devint: 'https://esp.dev.finra.org/esp-lookup/rest',
    dev: 'https://esp.qa.finra.org/esp-lookup/rest',
    devint: 'https://esp.qa.finra.org/esp-lookup/rest',
    qa: 'https://esp.qa.finra.org/esp-lookup/rest',
    qaint: 'https://esp.qa.finra.org/esp-lookup/rest',
    prod: 'https://esp.finra.org/esp-lookup/rest',
  };

  static alfWcHost: StringMap = {
    local: '', // all 'local' will go through angular localhost proxy (see proxy.config.js)
    dev: 'https://alf00-web-component.alfresco.dev.finra.org',
    devint: 'https://alf00-web-component-devint.alfresco.dev.finra.org',
    qa: 'https://alf00-web-component.alfresco.qa.finra.org',
    qaint: 'https://alf00-web-component.alfresco.qa.finra.org',
    prod: 'https://alf00-web-component.alfresco.finra.org',
  };

  static paths: StringArrayMap = {
    prod: [
      'enterprise.finra.org',
      'rcm.finra.org',
      'exam.finra.org',
      'alfresco.finra.org',
      'ucf.finra.org',
      'docgen.ccm.finra.org',
    ],
    qaint: ['-qaint'],
    qa: ['qa.finra.org', 'qa.aws.finra.org'],
    devint: ['-devint', '-int', 'exam.dev.finra.org'],
    dev: ['dev.finra.org', 'dev.aws.finra.org'],
    local: ['localhost', 'local.dev.finra.org'],
  };

  public static getEnv(host: string): string {
    // the order is important. *int should be chekced before appropriate non-int
    for (const iEnv of ['local', 'devint', 'qaint', 'dev', 'qa', 'prod']) {
      const pathsEnv = ApiHostService.paths[iEnv];
      for (const iPath of pathsEnv) {
        if (host.includes(iPath)) return iEnv;
      }
    }
    return 'local';
  }
  constructor(@Inject(DOCUMENT) private document: Document) {
    const host = document.defaultView?.location?.hostname || 'local.dev.finra.org';
    this._env = ApiHostService.getEnv(host);
    this._baseUrl = ApiHostService.hosts[this._env];
    this._espBaseUrl = ApiHostService.espHosts[this._env];
    this._alfWcHostBaseUrl = ApiHostService.alfWcHost[this._env];
  }

  public get env() {
    return this._env;
  }

  public get baseUrl() {
    return this._baseUrl;
  }

  public get espBaseUrl() {
    return this._espBaseUrl;
  }

  public get alfWcHost() {
    return this._alfWcHostBaseUrl;
  }

  public get iconPath() {
    if (this._env == 'local') {
      // in local our context does not have outbox-ui
      return `${this.baseUrl}/assets/icons`;
    } else {
      return `${this.baseUrl}/outbox-ui/assets/icons`;
    }
  }

  // strip protocol:port:host for UCF URLs to force them go through proxy
  public convertUcfUrl(ucfUrl: string) {
    if (this._env == 'local') {
      const url = new URL(ucfUrl);
      return url.pathname + url.search + url.hash;
    } else return ucfUrl;
  }
}
