import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { ApiHostService } from '../../service/api.host.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationApiService {
  constructor(private http: HttpClient, private apiHostService: ApiHostService) {}

  public getBusinessContext(code: string): Observable<any> {
    return this.http.get(`${this.apiHostService.baseUrl}/outbox-api/configuration/busines-context/${code}`, {
      withCredentials: true,
    });
  }

  public getContentStorage(code: string): Observable<any> {
    return this.http.get(`${this.apiHostService.baseUrl}/outbox-api/configuration/content-storage/${code}`, {
      withCredentials: true,
    });
  }

  public getDeliveryChannel(code: string): Observable<any> {
    return this.http.get(`${this.apiHostService.baseUrl}/outbox-api/configuration/delivery-channel/${code}`, {
      withCredentials: true,
    });
  }

  public getConfigurationByGroup(group: string): Observable<any> {
    return this.http
      .get(`${this.apiHostService.baseUrl}/outbox-api/configuration?group=${group}`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          return of(null);
        })
      );
  }

  public getConfiguration(): Observable<any> {
    return this.http.get(`${this.apiHostService.baseUrl}/outbox-api/configuration`, { withCredentials: true }).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }
}
