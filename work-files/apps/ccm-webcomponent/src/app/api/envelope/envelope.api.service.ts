import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { ApiHostService } from '../../service/api.host.service';
import { Envelope, RequestContactsData } from './envelope.api.interface';
import { PatchAssignees, PatchData } from '../../firm-request/models/patch-request.model';

import { ItemAction, ItemActionRequest } from '../../firm-request/models/item-action-request.model';

@Injectable({
  providedIn: 'root',
})
export class EnvelopeService {
  static HEADERS_JSON = { 'Content-Type': 'application/json; charset=utf-8' };

  constructor(private http: HttpClient, private apiHostService: ApiHostService) {}

  public search(query: any): Observable<Envelope[]> {
    return this.http.post<Envelope[]>(this.getEnvelopesApiSearchRoot(), query, {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  }

  public find(envelopeId: string): Observable<Envelope> {
    return this.http.get<Envelope>(`${this.getEnvelopesApiRoot()}/${envelopeId}`, {
      responseType: 'json',
      withCredentials: true,
    });
  }

  public async save(envelope: Envelope): Promise<Envelope> {
    if (envelope.envelopeId)
      return lastValueFrom(
        this.http.put<Envelope>(`${this.getEnvelopesApiRoot()}/${envelope.envelopeId}`, JSON.stringify(envelope), {
          responseType: 'json',
          withCredentials: true,
          headers: EnvelopeService.HEADERS_JSON,
        })
      );
    else
      return lastValueFrom(
        this.http.post<Envelope>(this.getEnvelopesApiRoot(), envelope, {
          responseType: 'json',
          withCredentials: true,
          headers: EnvelopeService.HEADERS_JSON,
        })
      );
  }

  public async delete(envelopeId: string): Promise<void> {
    return lastValueFrom(
      this.http.delete<void>(`${this.getEnvelopesApiRoot()}/${envelopeId}`, {
        responseType: 'json',
        withCredentials: true,
      })
    );
  }

  public async publish(envelope: Envelope): Promise<Envelope> {
    const envelopeId = envelope.envelopeId;
    if (envelopeId) {
      return lastValueFrom(
        this.http.put<Envelope>(`${this.getEnvelopesApiRoot()}/${envelopeId}/publish`, JSON.stringify(envelope), {
          responseType: 'json',
          withCredentials: true,
          headers: EnvelopeService.HEADERS_JSON,
        })
      );
    } else {
      return lastValueFrom(
        this.http.post<Envelope>(`${this.getEnvelopesApiRoot()}/publish`, JSON.stringify(envelope), {
          responseType: 'json',
          withCredentials: true,
          headers: EnvelopeService.HEADERS_JSON,
        })
      );
    }
  }

  private getEnvelopesApiRoot(): string {
    return `${this.apiHostService.baseUrl}/outbox-api/envelopes`;
  }

  private getEnvelopesApiSearchRoot(): string {
    return `${this.apiHostService.baseUrl}/search-api/envelopes`;
  }

  private getAccessPolicyApiRoot(): string {
    return `${this.apiHostService.baseUrl}/sentry-api/policy`;
  }

  public patch(
    envelopeId: string,
    idType: 'REQUEST' | 'ITEM',
    internalId: number,
    patchData: PatchData
  ): Observable<Envelope | null> {
    return this.http
      .patch<Envelope>(
        `${this.getEnvelopesApiRoot()}/internal/${envelopeId}/${idType}/${internalId}`,
        JSON.stringify(patchData),
        { responseType: 'json', withCredentials: true, headers: EnvelopeService.HEADERS_JSON }
      )
      .pipe(
        map((envelope: Envelope) => {
          return envelope;
        }),
        catchError((err) => {
          return of(null);
        })
      );
  }

  public updateAction(envelopeId: string, request: ItemActionRequest[], action: ItemAction): Observable<any> {
    return this.http.put<any>(
      `${this.getEnvelopesApiRoot()}/${envelopeId}/items/action/${action}`,
      JSON.stringify(request),
      { responseType: 'json', withCredentials: true, headers: EnvelopeService.HEADERS_JSON }
    );
  }

  // ["READ"] => read-only, ["WRITE"] => read/write. Other access levels may be added in a future.
  public getAccessLevel(accessPolicyId: string): Observable<String[]> {
    return this.http.get<String[]>(`${this.getAccessPolicyApiRoot()}/${accessPolicyId}/user-rights`, {
      responseType: 'json',
      withCredentials: true,
      headers: EnvelopeService.HEADERS_JSON,
    });
  }

  public async publishChanges(envelopeId: string, data: RequestContactsData): Promise<any> {
    return lastValueFrom(
      this.http.put<any>(`${this.getEnvelopesApiRoot()}/${envelopeId}/contacts`, JSON.stringify(data), {
        responseType: 'json',
        withCredentials: true,
        headers: EnvelopeService.HEADERS_JSON,
      })
    );
  }
}
