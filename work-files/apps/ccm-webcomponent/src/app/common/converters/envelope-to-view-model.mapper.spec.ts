import EnvelopeStatus from '../../firm-request/enums/envelope-status';
import { envelopeMapper } from './envelope-to-view-model.mapper';
import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';
import { ContactCategoryType } from '../../service/config/config.interface';

describe('envelope-to-view-model.mapper.ts', () => {
  it('GIVEN a published request, WHEN a request is NOT in Draft, Accepted or Withdrawn status, THEN the transfer button will be visible', () => {
    const MOCK_ENVELOPE = {
      isPublished: true,
      draftPayload: {
        envelopeId: '123',
        status: EnvelopeStatus.OPEN,
      },
    } as any;
    const envelope = {
      envelope: MOCK_ENVELOPE,
      config: { businessContext: {}, contacts: [] },
      selectedTemplate: { id: 123 },
    } as any;
    const result = envelopeMapper(envelope);
    expect(result.showTransferButton).toEqual(true);
  });

  it('Request for firm should be mapped with selectedFirm', () => {
    const MOCK_CRDID = Math.ceil(Math.random() * 10000).toString();
    const MOCK_FIRMNAME = 'CHARLES SCHWAB & CO., INC.';
    const MOCK_ENVELOPE = {
      isPublished: false,
      draftPayload: {
        envelopeId: '123',
        firmId: MOCK_CRDID,
        status: EnvelopeStatus.DRAFT,
        requestAssignees: {
          lstFirmData: [
            {
              id: MOCK_CRDID,
              name: MOCK_FIRMNAME,
            },
          ],
          lstPersonData: [],
        },
      },
    } as any;

    const MOCK_ENVELOPE_PUBLISHED = {
      isPublished: true,
      draftPayload: {
        envelopeId: '123',
        target: MOCK_FIRMNAME,
        status: EnvelopeStatus.OPEN,
        requestAssignees: {
          lstFirmData: [
            {
              id: MOCK_CRDID,
              name: MOCK_FIRMNAME,
            },
          ],
          lstPersonData: [],
        },
      },
    } as any;

    const MOCK_CONFIG = {
      businessContext: {},
      contacts: [
        {
          category: [ContactCategoryType.FIRM],
          crdId: MOCK_CRDID,
          name: MOCK_FIRMNAME,
        },
      ],
    };

    const viewModelSource = {
      envelope: MOCK_ENVELOPE,
      config: MOCK_CONFIG,
      selectedTemplate: { id: 123 },
    } as any;

    const viewModelSourcePublished = {
      envelope: MOCK_ENVELOPE_PUBLISHED,
      config: MOCK_CONFIG,
      selectedTemplate: { id: 123 },
    } as any;

    const result = envelopeMapper(viewModelSource);
    expect(result.contactsViewModel.selectedFirm?.crdId).toEqual(MOCK_CRDID);

    const resultPublished = envelopeMapper(viewModelSourcePublished);
    expect(resultPublished.contactsViewModel.selectedFirm?.crdId).toEqual(MOCK_CRDID);
  });

  it('Draft request for associated individual should be mapped with associatedFirm', () => {
    const MOCK_CRDID = Math.ceil(Math.random() * 10000).toString();
    const MOCK_FIRMNAME = 'CHARLES SCHWAB & CO., INC.';
    const MOCK_ENVELOPE = {
      isPublished: false,
      draftPayload: {
        envelopeId: '123',
        firmId: MOCK_CRDID,
        status: EnvelopeStatus.DRAFT,
        requestAssignees: {
          lstFirmData: [],
          lstPersonData: [
            {
              userId: 'testuser',
              email: 'test.user@gmail.com',
              firstName: 'Test',
              lastName: 'User',
              firmId: -2,
              orgClass: 'PUBLIC',
            },
          ],
        },
      },
    } as any;

    const MOCK_ENVELOPE_PUBLISHED = {
      isPublished: true,
      draftPayload: {
        envelopeId: '123',
        target: MOCK_FIRMNAME,
        status: EnvelopeStatus.OPEN,
        requestAssignees: {
          lstFirmData: [],
          lstPersonData: [
            {
              userId: 'testuser',
              email: 'test.user@gmail.com',
              firstName: 'Test',
              lastName: 'User',
              firmId: -2,
              orgClass: 'PUBLIC',
            },
          ],
        },
      },
    } as any;

    const MOCK_CONFIG = {
      businessContext: {},
      contacts: [
        {
          category: [ContactCategoryType.FIRM],
          name: MOCK_FIRMNAME,
          crdId: MOCK_CRDID,
        },
      ],
    };

    const envelope = {
      envelope: MOCK_ENVELOPE,
      config: MOCK_CONFIG,
      selectedTemplate: { id: 123 },
    } as any;

    const envelopePublished = {
      envelope: MOCK_ENVELOPE,
      config: MOCK_CONFIG,
      selectedTemplate: { id: 123 },
    } as any;

    const result = envelopeMapper(envelope);
    expect(result.contactsViewModel.associatedFirm?.crdId).toEqual(MOCK_CRDID);
    const resultPublished = envelopeMapper(envelopePublished);
    expect(resultPublished.contactsViewModel.associatedFirm?.crdId).toEqual(MOCK_CRDID);
  });

  it('Draft request to unassociated individual should be mapped with no firm artifacts', () => {
    const MOCK_CRDID = Math.ceil(Math.random() * 10000).toString();
    const MOCK_ENVELOPE = {
      isPublished: false,
      draftPayload: {
        envelopeId: '123',
        firmId: null,
        status: EnvelopeStatus.DRAFT,
        requestAssignees: {
          lstFirmData: [],
          lstPersonData: [
            {
              userId: 'testuser',
              email: 'test.user@gmail.com',
              firstName: 'Test',
              lastName: 'User',
              firmId: -2,
              orgClass: 'PUBLIC',
            },
          ],
        },
      },
    } as any;

    const MOCK_CONFIG = {
      businessContext: {},
      contacts: [
        {
          category: [ContactCategoryType.FIRM],
          crdId: MOCK_CRDID,
        },
      ],
    };

    const envelope = {
      envelope: MOCK_ENVELOPE,
      config: MOCK_CONFIG,
      selectedTemplate: { id: 123 },
    } as any;
    const result = envelopeMapper(envelope);
    expect(result.contactsViewModel.associatedFirm).toEqual(null);
    expect(result.contactsViewModel.selectedFirm).toEqual(null);
  });
});
