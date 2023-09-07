import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiLoadingIndicatorService {
  private loadingIndicatorSubject = new BehaviorSubject<boolean>(false);
  public loadingIndicator$ = this.loadingIndicatorSubject.asObservable();

  constructor() {}

  public show() {
    this.loadingIndicatorSubject.next(true);
  }
  public hide() {
    this.loadingIndicatorSubject.next(false);
  }
}
