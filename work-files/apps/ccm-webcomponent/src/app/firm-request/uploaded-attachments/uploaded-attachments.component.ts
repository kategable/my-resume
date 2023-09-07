import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ItemDataViewModel } from '../models/envelope-view-model';
import { AttachmentData, DocumentSource } from '../../api/envelope/envelope.api.interface';
import { ApiHostService } from '../../service/api.host.service';

@Component({
  selector: 'app-uploaded-attachments',
  templateUrl: './uploaded-attachments.component.html',
  styleUrls: ['./uploaded-attachments.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class UploadedAttachmentsComponent implements OnInit {
  @Input() canDownloadAll: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() defaultTab: string = '';
  @Input() item?: ItemDataViewModel;
  @Input() sentDocuments: AttachmentData[] = [];
  @Input() receivedDocuments: AttachmentData[] = [];
  @Input() documents: AttachmentData[] = [];
  @Output() onRemoveFile = new EventEmitter<number>();
  activeTab: string = '';
  private attachmentBaseUrl: string;

  sentLimit: number = 2;
  receivedLimit: number = 2;
  SENT = DocumentSource.SENT;
  RECEIVED = DocumentSource.RECEIVED;

  constructor(private apiHostService: ApiHostService) {
    this.attachmentBaseUrl = this.apiHostService.baseUrl + '/outbox-api';
  }
  ngOnInit(): void {
    this.activeTab = this.defaultTab;
  }

  downloadFile(file: AttachmentData) {
    const link = document.createElement('a');
    link.href = `${this.attachmentBaseUrl}/request-manager-attachment/${file.attachmentId}`;
    link.download = file.filename;
    link.click();
  }

  updateSentDocsLimit(limit: number) {
    this.sentLimit = limit;
  }

  updateReceivedDocsLimit(limit: number) {
    this.receivedLimit = limit;
  }

  downloadAllAttachments(downloadType: string) {
    window.location.href = `${this.attachmentBaseUrl}/envelopes/${this.item?.envelopeId}/items/${
      this.item?.item.entityId
    }/downloadType/${downloadType.toUpperCase()}`;
  }
  removeFile(attachmentId: number) {
    if (!this.readOnly) {
      this.onRemoveFile.emit(attachmentId);
      this.updateSentDocsLimit(this.sentDocuments.length);
    }
  }
}
