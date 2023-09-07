import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, takeUntil } from 'rxjs';
import { ConfigFacade } from '../service/config/config.facade';
import { Config } from '../service/config/config.interface';

import { TestConfigComponent } from './test-config.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TestConfigComponent', () => {
  let component: TestConfigComponent;
  let fixture: ComponentFixture<TestConfigComponent>;
  let configFacade: ConfigFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestConfigComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestConfigComponent);
    component = fixture.componentInstance;
    configFacade = TestBed.inject(ConfigFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update config', () => {
    const config = new Config();

    const _destroyed$ = new Subject<any>();
    configFacade.config$.pipe(takeUntil(_destroyed$)).subscribe((value: Config) => {
      expect(value).toBeTruthy();
      _destroyed$.next(true);
    });
    component.config = config;
    component.updateConfig();
  });
});
