import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public async getDeliveryChannels(): Promise<any[]> {
    return Promise.resolve([
      {
        code: 'RM',
        description: {
          brief: 'Request Manager channel.',
          full: 'Envelopes will be routed via Request Manager and result in an RM request with a lifecycle of the request managed by RM.',
        },
      },
      {
        code: 'MAN',
        description: {
          brief: 'Manual',
          full: 'Manual recording of sent correspondence',
        },
      },
      {
        code: 'ETC',
        description: {
          brief: 'ETC',
          full: 'Description of ETC envelope type',
        },
      },
    ]);
  }

  public async getRequestTypes(): Promise<any[]> {
    return Promise.resolve([
      { id: 'RPLY', name: 'Response required', desc: 'Request that requires a response' },
      { id: 'NRPL', name: 'No-reply', desc: 'Notificationb request that does not require a response' },
      { id: '8210', name: '8210', desc: 'Description of 8210 request type' },
    ]);
  }
}
