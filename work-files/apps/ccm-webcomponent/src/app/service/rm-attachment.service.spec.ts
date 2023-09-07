import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import SpyObj = jasmine.SpyObj;

import { RmAttachmentService } from './rm-attachment.service';
import { of } from 'rxjs';
import { LogService } from './log.service';

describe('RmAttachmentService', () => {
  let service: RmAttachmentService;
  let httpMock: any;
  let apiHostMock: any;
  beforeEach(() => {
    httpMock = jasmine.createSpyObj(HttpClient, ['patch', 'get', 'delete', 'put', 'post']);
    apiHostMock = jasmine.createSpyObj('ApiHostService', ['getUploadRoot']);
    service = new RmAttachmentService(httpMock, apiHostMock, new LogService());
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10 * 1000;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should upload file', async () => {
    const filename = 'hello.txt';
    const fileType = 'text';

    const uploadSize = 10;
    // const uploadSize = 10 * 1024 * 1024;
    let arrayBuffer = new ArrayBuffer(uploadSize);
    let bufView = new Uint8Array();
    bufView.fill(40);

    const file = new File([arrayBuffer], filename, { type: fileType, lastModified: new Date().getMilliseconds() });

    const uploadResult = await service.uploadFile(48, file);
    expect(uploadResult.filename).toEqual(filename);
  });

  xit('should download file', async () => {
    const downloadedFile = await service.downloadFile('5562888');
    expect(downloadedFile.type).toEqual('text');
  });

  it('should convert URL to file', async () => {
    const url = 'http://localhost:4200/favicon.ico';
    const fileName = 'favicon.ico';
    const retvalue = { name: fileName };
    httpMock.get.and.returnValue(of(retvalue));
    const file = await service.downloadUrlToJsFile(url, fileName);
    expect(file.name).toEqual(fileName);
  });
  //need to mock aws calls as an option
  xit('should uploadFile', async () => {
    const file = new File([], 'test.txt');
    const retvalue = { filename: 'test.txt' };

    httpMock.post.and.returnValue(of(retvalue));
    httpMock.get.and.returnValue(of({ uploadStatus: 'SUCCESS' }));
    const result = await service.uploadFile(1, file);
    expect(service.uploadFileV2).toHaveBeenCalled();
  });
});
