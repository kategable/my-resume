import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadedAttachmentsComponent } from './uploaded-attachments.component';

describe('UploadedAttachmentsComponent', () => {
  let component: UploadedAttachmentsComponent;

  beforeEach(async () => {
    component = new UploadedAttachmentsComponent({ baseUrl: 'http://localhost:4200' } as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as activeTab 'received'  `, () => {
    component.defaultTab = 'received';
    component.ngOnInit();
    expect(component.activeTab).toEqual('received');
  });

  it(`should have as activeTab 'sent'  `, () => {
    component.defaultTab = 'sent';
    component.ngOnInit();
    expect(component.activeTab).toEqual('sent');
  });

  it('should update sentLimit', () => {
    component.updateSentDocsLimit(5);
    expect(component.sentLimit).toEqual(5);
  });
  it('should update receivedLimit', () => {
    component.updateReceivedDocsLimit(5);
    expect(component.receivedLimit).toEqual(5);
  });
  it('should removeFile', () => {
    component.readOnly = false;
    component.removeFile(1);
    spyOn(component.onRemoveFile, 'emit');
    expect(component.sentLimit).toEqual(0);
  });
  it('should not removeFile', () => {
    component.readOnly = true;
    component.removeFile(1);
    spyOn(component.onRemoveFile, 'emit');
  });
});
