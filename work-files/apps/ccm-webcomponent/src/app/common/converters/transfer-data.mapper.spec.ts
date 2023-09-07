import { EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';
import { transferDataMapper } from './transfer-data.mapper';

describe('transfer-data.mapper.ts', () => {
  it('should map data', () => {
    const source = {
      contactsViewModel: { selectedContactsForIndividual: [], selectedStaffs: [] } as any,
    } as EnvelopeViewModel;

    const result = transferDataMapper(source);

    expect(result).toEqual({ assignees: [], notifications: [] });
  });
});
