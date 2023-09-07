/*
  The intent of the Façade is to provide a high-level interface (state, properties and methods)
*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, take } from 'rxjs';
import { ConfigurationApiService } from './configuration.api.service';
import { BusinessContext, ContentStorage, DeliveryChannel } from './configuration.api.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationApiFacade {
  public businessContext$: BehaviorSubject<BusinessContext> = new BehaviorSubject(new BusinessContext());
  private businessContext: BusinessContext = new BusinessContext();

  constructor(private api: ConfigurationApiService) {}

  public updateBusinessContext(node: any) {
    this.businessContext = { ...this.businessContext, ...node };
    this.businessContext$.next(this.businessContext);
  }

  public getBusinessContext(code: string): Observable<BusinessContext> {
    return this.api
      .getBusinessContext(code)
      .pipe(take(1))
      .pipe(
        map((businessContext: BusinessContext) => {
          this.updateBusinessContext(businessContext);
          return businessContext;
        })
      );
  }

  public getContentStorage(code: string): Observable<ContentStorage> {
    return this.api
      .getContentStorage(code)
      .pipe(take(1))
      .pipe(
        map((contentStorage: ContentStorage) => {
          this.updateBusinessContext(contentStorage);
          return contentStorage;
        })
      );
  }

  public getDeliveryChannel(code: string): Observable<DeliveryChannel> {
    return this.api
      .getDeliveryChannel(code)
      .pipe(take(1))
      .pipe(
        map((deliveryChannel: DeliveryChannel) => {
          this.updateBusinessContext(deliveryChannel);
          return deliveryChannel;
        })
      );
  }
}
