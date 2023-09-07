import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Alert, AlertService } from './alert.service';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let debugElement: DebugElement;
  let alertSubject = new BehaviorSubject<Alert | null>(null);
  let mockAlertService = { alert$: alertSubject.asObservable() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: AlertService, useValue: mockAlertService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.alert$).toBeDefined();
  });

  it('should not have any alert if no alert', () => {
    const view: DebugElement = debugElement.query(By.css('[data-test="ccm-alert]'));
    expect(view).toBeFalsy();
  });
  //TODO: make this work
  // fit('should have view if alert is present', fakeAsync(() => {
  //   component.alert$ = of({ message: 'test', type: 'success' } as Alert);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     const view: DebugElement = debugElement.query(By.css('[data-test="ccm-alert]'));
  //     expect(view).toBeTruthy();

  //   })
  // }))
});
