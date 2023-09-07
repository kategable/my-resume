import { DocumentSource } from '../../api/envelope/envelope.api.interface';
import { SentAttachmentPipe } from './sent-attachment.pipe';

describe('SentAttachmentPipe', () => {
  it('create an instance', () => {
    const pipe = new SentAttachmentPipe();
    expect(pipe).toBeTruthy();
  });
  it('should return empty array if no attachments', () => {
    const pipe = new SentAttachmentPipe();
    const result = pipe.transform({ item: { attachments: [] } } as any, { isPublished: true } as any);
    expect(result).toEqual([]);
  });
  it('should return array of 1 sent attachments if isPublished', () => {
    const pipe = new SentAttachmentPipe();
    const result = pipe.transform(
      { item: { attachments: [{ source: DocumentSource.SENT }, {}] } } as any,
      { isPublished: true } as any
    );
    expect(result.length).toEqual(1);
  });
  it('should return array of 2 sent attachments if not isPublished', () => {
    const pipe = new SentAttachmentPipe();
    const result = pipe.transform({ item: { attachments: [{}, {}] } } as any, { isPublished: false } as any);
    expect(result.length).toEqual(2);
  });
});
