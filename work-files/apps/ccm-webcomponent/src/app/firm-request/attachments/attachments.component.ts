import { Component, OnInit, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigurationApiFacade } from '../../api/configuration/configuration.api.facade';
import { BusinessContext } from '../../api/configuration/configuration.api.interface';
import { AlfWebComponentService } from '../../service/alf-web-components.service';
import { ApiHostService } from '../../service/api.host.service';
import { ConfigFacade } from '../../service/config/config.facade';
import { Config } from '../../service/config/config.interface';
import { RmAttachmentService, UploadStatus } from '../../service/rm-attachment.service';
import { AttachmentData } from '../../api/envelope/envelope.api.interface';
import { toIsoString } from '../../api/envelope/envelope-helper';
import { LogService } from '../../service/log.service';

interface AttachmentInProgress {
  filename: string;
  fileSize: number;
  loaded: number;
  total: number;
}

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AttachmentsComponent implements OnInit {
  @Input() model: AttachmentData[] = []; // the empty array is overridden by input data.
  @Input() isPublished: boolean = false;
  attachmentInProgress: AttachmentInProgress[] = [];

  @Input() templateId: number | string | undefined = '';

  config: Config = new Config();
  private attachmentBaseUrl: string;
  externalAttachment = {
    show: false,
    text: '',
    type: '',
  };

  activeTab: string = 'sent';

  constructor(
    private apiHostService: ApiHostService,
    private configFacade: ConfigFacade,
    private configurationApiFacade: ConfigurationApiFacade,
    private rmAttachmentService: RmAttachmentService,
    private alfWebComponentService: AlfWebComponentService,
    private changeDetectorRef: ChangeDetectorRef,
    private log: LogService
  ) {
    this.attachmentBaseUrl = this.apiHostService.baseUrl + '/outbox-api/request-manager-attachment/';
  }

  async ngOnInit() {
    this.config = (await firstValueFrom(this.configFacade.config$)) as Config;

    const businessContext: BusinessContext = await firstValueFrom(this.configurationApiFacade.businessContext$);
    this.externalAttachment = {
      show: businessContext.contentStorage?.storageProviderName === 'alfresco',
      text: businessContext.contentStorage?.description?.brief || '',
      type: businessContext.contentStorage?.contextTypeName || '',
    };
  }

  onAttachLocalFiles($event: any) {
    const files: File[] = Object.assign([], $event?.target?.files) || [];
    if ($event.target) $event.target.value = null; // clear file selection - to allow attaching the same file again after deletion
    this.attachFiles(Array.from(files));
  }

  async onAttachExternalFiles() {
    const files = await this.alfWebComponentService.showModal(
      this.externalAttachment.type,
      this.config.businessContext?.businessId
    );

    const newFiles: File[] = [];

    for (const file of files) {
      const newFile = await this.rmAttachmentService.downloadUrlToJsFile(
        this.apiHostService.convertUcfUrl(file.downloadUrl),
        file.name,
        new Date()
      );
      newFiles.push(newFile);
    }
    this.attachFiles(newFiles);
  }

  async attachFiles(files: File[]) {
    if (!this.templateId) {
      const defaultRequestTemplateId = 48;
      alert(
        `attachments.component: Caller has not provided requestTemplateId parameter. Using default of ${defaultRequestTemplateId}`
      );
      this.templateId = defaultRequestTemplateId;
    }

    // TBD resolve issue with attachments under the same name.
    files.forEach((f: File) => {
      if (f.size) {
        this.attachmentInProgress.push({ filename: f.name, fileSize: f.size, loaded: 0, total: f.size });
      } else this.log.error('Put to error reporting UI when ready: ignoring zero-length file');
    });

    files.forEach(async (file: any) => {
      try {
        const uploadresult = await this.rmAttachmentService.uploadFile(
          this.templateId || '',
          file,
          (status: UploadStatus) => {
            // update upload progress
            const currFile = this.attachmentInProgress.find((f: any) => f.filename === file.name);
            if (currFile) {
              currFile.loaded = status.loaded;
              currFile.total = status.total;
            }
          }
        );
        // put to done array
        this.model.push({
          attachmentId: uploadresult.attachmentId,
          filename: file.name,
          contentType: file.type,
          uploadDate: toIsoString(new Date()),
          fileSize: file.size,
          externalAttachmentUrl: '', // has to be blank for uploaded attachments
        });
      } catch (error) {
        const msg = `'Put to error reporting UI when ready: failed to upload file: ${file.name}, ${error}`;
        this.log.error(msg);
        alert(msg);
      } finally {
        // remove from in-progress array
        this.attachmentInProgress.forEach((e, i, a) => {
          if (e.filename === file.name) {
            a.splice(i, 1);
          }
          this.changeDetectorRef.detectChanges();
        });
      }
    });
  }

  downloadFile(file: AttachmentData) {
    const link = document.createElement('a');
    link.href = `${this.attachmentBaseUrl}${file.attachmentId}`;
    link.download = file.filename;
    link.click();
  }

  onRemoveFile(index: number) {
    this.model.splice(index, 1);
  }

  getAllFilesSize(): number {
    return this.model.map((m) => m.fileSize).reduce((sum, current) => sum + current);
  }
}
