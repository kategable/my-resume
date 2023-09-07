import { ItemData } from '../../api/envelope/envelope.api.interface';
import { itemIconMapper } from './item-icon.mapper';
describe('itemIconMapper', () => {
  it('should return icon for Draft', () => {
    const item: ItemData = {
      status: 'Draft',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('PencilRuler');
  });
  it('should return icon for Open', () => {
    const item: ItemData = {
      status: 'Open',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('Envelope');
  });
  it('should return icon for Submitted', () => {
    const item: ItemData = {
      status: 'Submitted',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('InboxIn');
  });
  it('should return icon for Accepted', () => {
    const item: ItemData = {
      status: 'Accepted',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('FileCheck');
  });
  it('should return icon for Withdrawn', () => {
    const item: ItemData = {
      status: 'Withdrawn',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('MinusSquare');
  });
  it('should return icon for FileExport', () => {
    const item: ItemData = {
      status: 'No Response',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('FileExport');
  });
  it('should return icon for Overdue', () => {
    const item: ItemData = {
      status: 'Overdue',
    } as any;
    const result = itemIconMapper(item);
    expect(result).toEqual('AlarmExclamation');
  });
});
