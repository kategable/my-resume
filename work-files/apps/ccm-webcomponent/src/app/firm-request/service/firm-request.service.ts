import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import TemplateModel from '../models/template';
import TemplatesResponseModel from '../models/templates-response.model';
import { ApiHostService } from '../../service/api.host.service';
import { RequestTemplate, fallbackRequestTemplate } from '../../api/envelope/envelope.api.interface';
import { ItemTemplateApi } from '../../api/envelope/template.api.interface';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { Contacts } from '../../service/config/config.interface';
import { contactMapper } from '../../common/converters/dxt-to-contacts.mapper';
import { mapList } from '../../common/converters/mappers';
import { FirmToContactsMappers } from '../../common/converters/firm-to-contact.mapper';
@Injectable({
  providedIn: 'root',
})
export class FirmRequestService {
  constructor(private http: HttpClient, private apiHostService: ApiHostService) {}

  async fetchRequestManagerTemplates(tags: any): Promise<TemplatesResponseModel> {
    const tagsStr = tags.reduce((acc: any, curr: any) => acc + ',' + curr.name, '');
    const data: any = await firstValueFrom(
      this.http.get(`${this.apiHostService.baseUrl}/outbox-api/request-manager-templates?tag=${tagsStr}`, {
        withCredentials: true,
      })
    );
    return data;
  }

  fetchRequestManagerTemplatesForCaseId(caseId?: any): Observable<RequestTemplate[]> {
    return this.http
      .get<any>(
        `${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/request-templates?showRelevant=true&caseId=${caseId}`,
        { withCredentials: true }
      )
      .pipe(map((data) => data?.list || []));
  }

  // These function return includes templates for wrong case category that results
  // in silent RM error: "Mismatch case category".
  // For now the modal dialog that uses data returned by this function is disabled.
  // TODO: find right method to get relevant (i.e. applicable) templates
  // should be smth like to get case category, and find templates for the category

  fetchRequestManagerTemplatesAll(): Observable<RequestTemplate[]> {
    return this.http
      .get<any>(`${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/request-templates`, {
        withCredentials: true,
      })
      .pipe(map((data) => data?.list || []));
  }

  adhocItemTemplateCategories$: Observable<string[]> = this.http.get<string[]>(
    `${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/adhoc-item-categories`,
    { withCredentials: true }
  );

  fetchRequestManagerItemsForRequestTemplateId(
    requestTemplateId: string | null | undefined
  ): Observable<ItemTemplateApi[]> {
    if (requestTemplateId === undefined || requestTemplateId === null) {
      throw new Error('requestTemplateId is undefined or null');
    }
    return this.http
      .get<any>(
        `${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/item-templates?requestTemplateId=${requestTemplateId}`,
        { withCredentials: true }
      )
      .pipe(
        map((data) => data?.list || []),
        catchError((err) => {
          return of([]);
        })
      );
  }
  fetchRequestManagerItemsNoRequestTemplateId(): Observable<ItemTemplateApi[]> {
    return this.http
      .get<any>(`${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/item-templates`, {
        withCredentials: true,
      })
      .pipe(
        map(
          (data) => data?.list || [],
          catchError((err) => {
            console.error('fetchRequestManagerItemsNoRequestTemplateId', err);
            return of([]);
          })
        )
      );
  }

  fetchContactsOfFirm(firmId: string): Observable<Contacts[]> {
    return this.http
      .get<any>(`${this.apiHostService.baseUrl}/outbox-api/contacts/firm/${firmId}`, {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (!response?.body) return [];
          if (response.body.errors) {
            return [];
          }
          return mapList(contactMapper)(response.body.data.regulatoryContacts);
        }),
        catchError((err) => {
          console.error(err);
          return of([]);
        })
      );
  }

  async fetchInternalContacts(searchString: string): Promise<InternalContact[]> {
    return await firstValueFrom(this.getContacts(searchString));
  }
  searchContacts(searchString: string): Observable<InternalContact[]> {
    return this.getContacts(searchString);
  }
  private getContacts(searchString: string): Observable<InternalContact[]> {
    return this.http
      .get(`${this.apiHostService.espBaseUrl}?query=${searchString}&sources=USERS`, { withCredentials: true })
      .pipe(
        map((response: any) => {
          if (response.errorMessage) {
            return [];
          }
          return response.results.USERS.results as InternalContact[];
        }),
        catchError((err) => {
          console.error('fetchInternalContacts', err);
          return [];
        })
      );
  }

  fetchClearingFirmsOfFirm(firmId?: any): Observable<Contacts[]> {
    return this.http
      .get(`${this.apiHostService.baseUrl}/outbox-api/request-manager-proxy/clearing-firms/${firmId}`, {
        withCredentials: true,
      })
      .pipe(
        map((data: any) => {
          return mapList(FirmToContactsMappers.firmToContactMapper)(data?.clearingFirms) || [];
        })
      );
  }

  getRequestTemplate(requestTemplateId: string): Observable<RequestTemplate> {
    return this.http
      .get<RequestTemplate>(
        `${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/request-template/${requestTemplateId}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((err) => {
          // well, setting email body/subject of default values are better than rejecting to open envelope
          console.log(`failed to retrieve request template ${requestTemplateId}, using fallback`);
          return of(fallbackRequestTemplate);
        })
      );
  }

  // TODO: orphan method, kill it
  async getRequestManagerTemplate(id: any): Promise<TemplateModel> {
    const data: any = await this.http
      .get(`${this.apiHostService.baseUrl}/outbox-api/request-manager-templates/proxy/${id}`, { withCredentials: true })
      .toPromise();
    return data;
  }
}

export interface InternalContact {
  fields: InternalContactField;
  highlightedFields: any;
  score: number;
}

export interface InternalContactField {
  ac_finra_users_title: string;
  ac_finra_users_firstname: string;
  ac_source_id: string;
  ac_finra_users_parent_dept: string;
  ac_finra_users_fullname: string;
  ac_finra_users_department: string;
  ac_finra_users_location_code: string;
  ac_finra_users_lastname: string;
  ac_finra_users_email_address: string;
  ac_finra_users_location: string;
}
