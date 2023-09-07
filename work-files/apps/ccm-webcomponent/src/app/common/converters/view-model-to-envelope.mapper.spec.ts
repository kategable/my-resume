import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';
import { ViewModelToEnvelopeMapper } from './view-model-to-envelope.mapper';

describe('ViewModelToEnvelopeMapper', () => {
  it('should return INDIVIDUAL from getRequestTargetType', () => {
    const viewModel = {} as any;
    const result = ViewModelToEnvelopeMapper.getRequestTargetType(viewModel);
    expect(result).toEqual('INDIVIDUAL');
  });
  it('should return FIRM from getRequestTargetType', () => {
    const viewModel = { recipientType: FirmIndividualType.FIRM } as any;
    const result = ViewModelToEnvelopeMapper.getRequestTargetType(viewModel);
    expect(result).toEqual('FIRM');
  });
  it('should return INDIVIDUAL_ASSOCIATED from getRequestTargetType', () => {
    const viewModel = { associatedFirm: {} } as any;
    const result = ViewModelToEnvelopeMapper.getRequestTargetType(viewModel);
    expect(result).toEqual('INDIVIDUAL_ASSOCIATED');
  });
  it('should return Envelope from toEnvelope for Firm ', () => {
    const viewModel = {
      itemsViewModel: { items: [] },
      contactsViewModel: {
        recipientType: FirmIndividualType.FIRM,
        lstAttachments: [],
        selectedStaffs: [],
        selectedContactsForIndividual: [],
        selectedContactsForFirm: [],
        selectedFirm: { crdId: 123 },
      },
    } as any;
    const config = { businessContext: { businessObjects: [] } } as any;
    const result = ViewModelToEnvelopeMapper.toEnvelope(viewModel, config);
    expect(result).toEqual({
      accessPolicyId: undefined,
      clientId: '1',
      envelopeId: undefined,
      deliveryChannelCode: 'RM',
      requestManagerId: '',
      draftPayload: Object({
        id: null,
        version: undefined,
        templateId: undefined,
        caseId: undefined,
        lstItemData: [],
        firmId: 123,
        emailSubjectPrepend: undefined,
        emailSubjectEditable: undefined,
        notificationMsg: undefined,
        includeContactInfo: undefined,
        phone: undefined,
        extension: undefined,
        email: undefined,
        requestAssignees: { lstFirmData: [{ id: 123, name: undefined }] },
        lstAttachments: [],
        dataRequestContacts: Object({
          requestId: null,
          caseTypeCd: '27',
          caseCategoryName: 'CAUSE',
          requiredRoles: [Object({ id: 27, name: 'Regulatory Inquiries' })],
          firmDataInternal: Object({}),
          lstFirmDataExternal: [Object({ lstUserGroupDataSelected: [] })],
        }),
      }),
      businessObjects: [],
      businessId: undefined,
    } as any);
  });

  it('should return Envelope from toEnvelope for Individual ', () => {
    const viewModel = {
      itemsViewModel: { items: [] },
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        lstAttachments: [],
        selectedStaffs: [],
        selectedContactsForIndividual: [],
        selectedContactsForFirm: [],
        selectedFirm: { crdId: 123 },
        businessObjects: [],
      },
    } as any;
    const config = { businessContext: { businessObjects: [] } } as any;
    const result = ViewModelToEnvelopeMapper.toEnvelope(viewModel, config);
    expect(result).toEqual({
      accessPolicyId: undefined,
      clientId: '1',
      envelopeId: undefined,
      deliveryChannelCode: 'RM',
      requestManagerId: '',
      draftPayload: Object({
        id: null,
        version: undefined,
        templateId: undefined,
        caseId: undefined,
        lstItemData: [],
        firmId: null,
        emailSubjectPrepend: undefined,
        emailSubjectEditable: undefined,
        notificationMsg: undefined,
        includeContactInfo: undefined,
        phone: undefined,
        extension: undefined,
        email: undefined,
        requestAssignees: Object({ lstFirmData: [], lstPersonData: [] }),
        lstAttachments: [],
        dataRequestContacts: Object({
          requestId: null,
          caseTypeCd: '27',
          caseCategoryName: 'CAUSE',
          requiredRoles: [Object({ id: 27, name: 'Regulatory Inquiries' })],
          firmDataInternal: Object({}),
          lstFirmDataExternal: [Object({ lstUserGroupDataSelected: [] })],
        }),
      }),
      businessObjects: [],
      businessId: undefined,
    } as any);
  });

  it('should return Envelope from toEnvelope for Individual ', () => {
    const viewModel = {
      itemsViewModel: { items: [] },
      contactsViewModel: {
        recipientType: FirmIndividualType.INDIVIDUAL,
        associatedFirm: { crdId: 123 },
        lstAttachments: [{ total: 0, loaded: true }],
        selectedStaffs: [],
        selectedContactsForIndividual: [],
        selectedContactsForFirm: [],
      },
    } as any;
    const config = { businessContext: { businessObjects: [] } } as any;
    const result = ViewModelToEnvelopeMapper.toEnvelope(viewModel, config);
    expect(result).toEqual({
      accessPolicyId: undefined,
      clientId: '1',
      envelopeId: undefined,
      deliveryChannelCode: 'RM',
      requestManagerId: '',
      draftPayload: Object({
        id: null,
        version: undefined,
        templateId: undefined,
        caseId: undefined,
        lstItemData: [],
        firmId: 123,
        emailSubjectPrepend: undefined,
        emailSubjectEditable: undefined,
        notificationMsg: undefined,
        includeContactInfo: undefined,
        phone: undefined,
        extension: undefined,
        email: undefined,
        requestAssignees: Object({ lstFirmData: [], lstPersonData: [] }),
        lstAttachments: [Object({})],
        dataRequestContacts: Object({
          requestId: null,
          caseTypeCd: '27',
          caseCategoryName: 'CAUSE',
          requiredRoles: [Object({ id: 27, name: 'Regulatory Inquiries' })],
          firmDataInternal: Object({}),
          lstFirmDataExternal: [Object({ lstUserGroupDataSelected: [] })],
        }),
      }),
      businessObjects: [],
      businessId: undefined,
    } as any);
  });
});
