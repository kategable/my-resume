/*
  The intent of the Façade is to provide a high-level interface (state, properties and methods)
*/
import { Inject, Injectable } from '@angular/core';
import { ApiHostService } from './api.host.service';
import { first } from 'rxjs';
import { LogService } from './log.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../common/window';

export interface SelectedResource {
  downloadUrl: string;
  name: string;
}
export interface AlfSelectionCallback {
  alfSelectionCallback(selected: SelectedResource[]): void;
}

@Injectable({
  providedIn: 'root',
})
export class AlfWebComponentService {
  constructor(
    private readonly apiHost: ApiHostService,
    @Inject(WINDOW) private readonly window: Window,
    @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly log: LogService
  ) {}

  public async showModal(contextType: string, businessId: string): Promise<SelectedResource[]> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const service = this.window.AlfWebComponentService;
      service()
        ?.fileSelection.selectedNodes$.pipe(first())
        .subscribe((files: SelectedResource[]) => resolve(files));

      service()?.fileSelection.entityState$.next({
        contextType: contextType,
        contextId: businessId,
      });
    });
  }

  public load(): void {
    const host = this.apiHost.alfWcHost;
    const url = host + '/releases/v1.0.0/alf-web-components-1.0.0.js';
    this.loadScript('alfWebComponents', url);
  }

  public loadScript(tagId: string, url: string, async = true): void {
    if (this.document.getElementById(tagId)) return;

    let scriptEle = this.document.createElement('script');
    scriptEle.setAttribute('id', tagId);
    scriptEle.setAttribute('src', url);
    scriptEle.setAttribute('type', 'text/javascript');
    scriptEle.setAttribute('async', async.toString());

    this.document.head.appendChild(scriptEle);

    // error event
    scriptEle.addEventListener('error', (ev) => {
      scriptEle.removeEventListener(
        'error',
        () => {
          this.log.error(`Error loading ${tagId}`);
        },
        false
      );
    });
  }
}
