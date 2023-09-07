import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiStateService } from '../service/ui-state.service';

import { ComposerComponent } from './composer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComposerView } from '../firm-request/enums/composer-view';

describe('ComposerComponent', () => {
  let component: ComposerComponent;
  let fixture: ComponentFixture<ComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComposerComponent],
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{ provide: Window, useValue: window }, UiStateService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return isIntroView for CREATE_ENVELOPE', () => {
    expect(component.isIntroView(ComposerView.CREATE_ENVELOPE)).toBeFalse();
  });
  it('should return isIntroView for INTRO', () => {
    expect(component.isIntroView(ComposerView.INTRO)).toBeTrue();
  });

  it('should return isCreateEnvelopeView for CREATE_ENVELOPE', () => {
    expect(component.isCreateEnvelopeView(ComposerView.CREATE_ENVELOPE)).toBeTrue();
  });
  it('should return isCreateEnvelopeView for INTRO', () => {
    expect(component.isCreateEnvelopeView(ComposerView.INTRO)).toBeFalse();
  });
});
