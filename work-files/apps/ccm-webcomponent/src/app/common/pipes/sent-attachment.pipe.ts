import { Pipe, PipeTransform } from '@angular/core';
import { AttachmentData, DocumentSource } from '../../api/envelope/envelope.api.interface';
import { EnvelopeViewModel, ItemDataViewModel, ItemsViewModel } from '../../firm-request/models/envelope-view-model';

@Pipe({
  name: 'sentAttachment',
})
export class SentAttachmentPipe implements PipeTransform {
  transform(model: ItemDataViewModel, viewModel: EnvelopeViewModel): AttachmentData[] {
    if (viewModel.isPublished) {
      return model.item.attachments?.filter((document: AttachmentData) => document.source === DocumentSource.SENT);
    }
    return model.item.attachments;
  }
}
