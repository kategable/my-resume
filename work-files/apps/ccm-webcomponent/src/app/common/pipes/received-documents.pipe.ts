import { Pipe, PipeTransform } from '@angular/core';
import { AttachmentData, DocumentSource } from '../../api/envelope/envelope.api.interface';
import { ItemDataViewModel } from '../../firm-request/models/envelope-view-model';

@Pipe({
  name: 'receivedDocuments',
})
export class ReceivedDocumentsPipe implements PipeTransform {
  transform(model: ItemDataViewModel, ...args: unknown[]): AttachmentData[] {
    return model.item.attachments?.filter((document: AttachmentData) => document.source === DocumentSource.RECEIVED);
  }
}
