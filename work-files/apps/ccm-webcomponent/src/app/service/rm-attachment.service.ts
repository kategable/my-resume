import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiHostService } from './api.host.service';

import AWS from 'aws-sdk';
import { LogService } from './log.service';

// settings for 'global not defined' issue
// https://github.com/aws/aws-sdk-js/issues/2141#issuecomment-406987761

interface InitResponse {
  uuid: string;
  awsKey: string;
  awsSecretKey: string;
  awsSessionToken: string;
  bucketName: string;
  filePath: string;
  endpoint: string;
  expirationTime: string;
  attachmentId: bigint;
  kmsId: string;
}

interface RmUploadResult {
  filename: string;
  fileSize: number;
  contentType: string;
  uploadDate: string;
  attachmentId: string;
  uuid: string;
  uploadStatus: string;
  businessDataKey: any;
  attachmentUrl: string;
  externalAttachmentUrl: string;
}

export interface UploadStatus {
  loaded: number; // bytes
  total: number; // bytes
  part: number; // 5MB part number
  Bucket: string;
  Key: string;
}

@Injectable({
  providedIn: 'root',
})
export class RmAttachmentService {
  public uploadPartSize = 1024 * 1024 * 5; // 5MB

  static HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

  static useMultipartS3 = true;
  static staticLog: LogService;
  constructor(
    private readonly http: HttpClient,
    private readonly apiHostService: ApiHostService,
    private readonly log: LogService
  ) {
    RmAttachmentService.staticLog = log;
  }

  public async downloadUrlToJsFile(downloadUrl: string, fileName: string, lastModifiedDate?: Date): Promise<File> {
    let file = (await firstValueFrom(
      this.http.get(downloadUrl, { withCredentials: true, responseType: 'blob' })
    )) as any;
    file.name = fileName;
    file.lastModifiedDate = lastModifiedDate || new Date();
    return <File>file;
  }

  public async uploadFile(
    requestTemplateId: number | string,
    file: File,
    callback?: (status: UploadStatus) => void
  ): Promise<RmUploadResult> {
    return this.uploadFileV2(requestTemplateId, file, callback);
  }

  private async timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static getFileName(headers: HttpHeaders) {
    let ret = 'Undefined';
    const contentDispArray = headers.get('content-disposition');
    if (contentDispArray && contentDispArray[0]) {
      contentDispArray[0].split(';').forEach((h) => {
        if (h.toLowerCase().startsWith('filename=')) {
          const filename = h.split('=')[1];
          ret = filename.replace(/^ *"/, '').replace(/" *$/, ''); //remove surrouning quotes
        }
      });
    }
    return ret;
  }

  public async downloadFile(attachmentId: number | string): Promise<File> {
    const respObservable = this.http.get(`${this.getUploadRoot()}/${attachmentId}`, {
      observe: 'response',
      responseType: 'arraybuffer',
      withCredentials: true,
    });
    const resp = await lastValueFrom(respObservable);
    const file = new File([resp.body ?? new ArrayBuffer(0)], RmAttachmentService.getFileName(resp.headers), {
      type: resp.headers.get('content-type') ?? 'application/octet-stream',
      lastModified: Date.now(),
    });
    return file;
  }

  private getUploadRoot(): string {
    return `${this.apiHostService.baseUrl}/outbox-api/request-manager-attachment`;
  }

  public async uploadFileV2(
    requestTemplateId: number | string,
    file: File,
    callback?: (status: UploadStatus) => void
  ): Promise<RmUploadResult> {
    // 0. sanity check
    if (!requestTemplateId) {
      const err = 'ERROR: rm-attachment-service: requestTemplateId is not provided. Failing file upload';
      alert(err);
      throw err;
    }

    // 1. Initiate upload
    const initBody = {
      requestTemplateId: requestTemplateId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };

    const initResp = this.http.post(this.getUploadRoot(), initBody, {
      withCredentials: true,
      headers: RmAttachmentService.HEADERS,
    });

    const initJson = (await lastValueFrom(initResp)) as InitResponse;
    const expirationTime = new Date(parseFloat(initJson.expirationTime));

    AWS.config.update({
      signatureVersion: 'v4',
      // @ts-ignore
      endpoint: initJson.endpoint, // update() method does not allow this property
    });

    var credentials = new AWS.Credentials({
      accessKeyId: initJson.awsKey,
      secretAccessKey: initJson.awsSecretKey,
      sessionToken: initJson.awsSessionToken,
    });

    // 2. Upload to S3
    const bucket = new AWS.S3({ credentials: credentials });

    const params = {
      Bucket: initJson.bucketName,
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: initJson.kmsId,
      Key: initJson.filePath,
      ContentType: file.type,
      Body: file,
    } as AWS.S3.PutObjectRequest;

    bucket.upload(params, {}, function (err, data) {
      if (err) {
        RmAttachmentService.staticLog.error('bucket.upload error', err);
      } else {
        RmAttachmentService.staticLog.error('bucket.upload success', file);
      }
    });

    // 3. Get status
    const delay = 500 + file.size / 1000000; // 0.5sec + 1sec per GB
    const maxTry = 32;

    let rmUploadResult = null;
    for (let i = 0; i < maxTry; i++) {
      await this.timeout(delay);
      rmUploadResult = (await lastValueFrom(
        this.http.get(`${this.getUploadRoot()}/${initJson?.uuid}/status`, { withCredentials: true })
      )) as RmUploadResult;

      if ('Unsubmitted' == rmUploadResult?.uploadStatus) {
        return rmUploadResult;
      }
    }
    throw new Error(`Upload failed, status: ${rmUploadResult?.uploadStatus}`);
  }
}
