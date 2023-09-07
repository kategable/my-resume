import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHostService } from './api.host.service';
import { Observable, catchError, from, lastValueFrom, map, of, shareReplay } from 'rxjs';
import { TagContentType } from '@angular/compiler';

export interface Actor {
  username: string | null;
  client?: {
    ags: string;
    amgGroup: string;
    createdBy: string;
    id: number;
    isActive: boolean;
    name: string;
  };
}

export enum SentryMessage {
  SUCCESS = 'Account registered successfully',
  ERR_NOAUTH = 'Not Authenticated',
  ERR_NOGROUP = 'Actor does not have a valid AMG group to link with a client.',
  ERR_MULTIPLE_GROUPS = 'Multiple linkable clients detected for actor. Please explicitly specify a client to link with.',
  ERR_REGISTER_FAIL = 'Failed to register',
  ERR_GENERIC = 'Generic error',
}

export interface SentryError {
  message: SentryMessage | string;
  error: any;
}

export interface RegisterResponse {
  value: SentryMessage;
}

export interface ApiErrorResponse {
  timestamp: Date;
  path: string; // "POST /sentry-api/actor/register", etc
  status: string; // "404", etc
  reason: string; // "Not found", etc
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiSentryService {
  constructor(private http: HttpClient, private apiHostService: ApiHostService) {}

  // outcomes are:
  // - OK, here is the actor
  // - not authenticated
  // - not a member of any CCM team/client
  // - member of more than 1 team.
  getOrRegisterActor(): Observable<Actor> {
    return from(this.getActor());
  }

  // This method may perform up to 3 http API calls.
  // It uses single-response Promise for each of the calls.
  // Using multi-response Observable instead end up of handling 3 nested streams of events, which Is tricky.
  async getActor(): Promise<Actor> {
    const getActorCall = () =>
      lastValueFrom(this.http.get<Actor>(`${this.apiHostService.baseUrl}/sentry-api/actor`, { withCredentials: true }));
    try {
      const ret: Actor = await getActorCall();
      if (ret.username) return ret; // OK, return registered actor
      else throw { message: SentryMessage.ERR_NOAUTH } as SentryError; // FIP redirect, we can not auth at XHR
    } catch (err) {
      if (err instanceof HttpErrorResponse && err.status == 404) {
        // not found, try to register
        try {
          const retRegister = await lastValueFrom(
            this.http.post<RegisterResponse>(
              `${this.apiHostService.baseUrl}/sentry-api/actor/register`,
              {},
              { withCredentials: true }
            )
          );
          const retFollowup = await getActorCall();
          if (retFollowup.username) return retFollowup;
          else throw { message: SentryMessage.ERR_NOAUTH } as SentryError;
        } catch (errReg) {
          // failed to register
          if (errReg instanceof HttpErrorResponse && errReg.statusText) {
            const errJson = JSON.parse(errReg.statusText);
            throw { message: errJson?.message, error: errReg }; // may be ERR_NOGROUP | ERR_MULTIPLE_GROUPS
          } else {
            throw { message: SentryMessage.ERR_REGISTER_FAIL, error: errReg };
          }
        }
      } else {
        throw { message: SentryMessage.ERR_NOAUTH, error: err };
      }
    }
  }

  fetchAccessPolicyId(tag: string): Observable<string> {
    const url = `${this.apiHostService.baseUrl}/sentry-api/policy`;
    return this.http
      .get<string[]>(url, {
        withCredentials: true,
        params: {
          tag,
        },
      })
      .pipe(
        map((policyIds) => policyIds[0]),
        catchError((error) => of(''))
      );
  }
}
