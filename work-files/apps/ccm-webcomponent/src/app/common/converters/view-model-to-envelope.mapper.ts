import { AttachmentData, Envelope, RequestAssigneeData, RequestData } from '../../api/envelope/envelope.api.interface';
import { FirmIndividualType, RequestTargetType } from '../../firm-request/enums/firm-rep-type';
import { ContactViewModel, EnvelopeViewModel } from '../../firm-request/models/envelope-view-model';
import { selectedFirmMapper } from './selected-firm.mapper';
import { mapList } from './mappers';
import { dataRequestContactsMapper } from './data-request-contacts.mapper';
import { selectedIndividualsMapper } from './selected-individuals.mapper';
import { DELIVERY_CHANNEL_CODE } from '../constants/envelope.constants';
import { itemsViewModelMapper } from './items-view-model.mapper';
import { Config } from '../../service/config/config.interface';
export class ViewModelToEnvelopeMapper {
  public static getRequestTargetType(contactViewModel: ContactViewModel): RequestTargetType {
    if (contactViewModel.recipientType == FirmIndividualType.FIRM) return RequestTargetType.FIRM;
    else if (contactViewModel!.associatedFirm) return RequestTargetType.INDIVIDUAL_ASSOCIATED;
    else return RequestTargetType.INDIVIDUAL;
  }
  public static toEnvelope = (source: EnvelopeViewModel, config: Config): Envelope => {
    const lstItemData = itemsViewModelMapper(source.itemsViewModel);
    let requestAssignees: RequestAssigneeData = {} as RequestAssigneeData;
    requestAssignees.lstFirmData = [];
    const dataRequestContacts = dataRequestContactsMapper(null, source.contactsViewModel);
    let firmId = source.contactsViewModel.selectedFirm?.crdId || null;
    const requestTargetType = this.getRequestTargetType(source.contactsViewModel);

    if (requestTargetType === RequestTargetType.FIRM) {
      requestAssignees.lstFirmData = selectedFirmMapper(source.contactsViewModel.selectedFirm);
    } else {
      // INDIVIDUAL | INDIVIDUAL_ASSOCIATED
      requestAssignees.lstPersonData = mapList(selectedIndividualsMapper)(source.contactsViewModel.selectedIndividuals);
      if (requestTargetType === RequestTargetType.INDIVIDUAL) firmId = null;
      if (requestTargetType === RequestTargetType.INDIVIDUAL_ASSOCIATED)
        firmId = source.contactsViewModel.associatedFirm?.crdId || null;
    }

    const envelope = {
      accessPolicyId: source.accessPolicyId,
      clientId: '1',
      envelopeId: source.contactsViewModel.isNew ? null : source.contactsViewModel.envelopeId,
      deliveryChannelCode: DELIVERY_CHANNEL_CODE,
      requestManagerId: '',
      draftPayload: {
        id: source.draftPayloadId || null,
        version: source.draftPayloadVersion,
        templateId: source.templateId,
        caseId: source.caseId,
        lstItemData,
        firmId,
        emailSubjectPrepend: source.contactsViewModel.emailSubjectPrepend,
        emailSubjectEditable: source.contactsViewModel.emailSubjectEditable,
        notificationMsg: source.contactsViewModel.notificationMsg,
        includeContactInfo: source.contactsViewModel.includeContactInfo,
        phone: source.contactsViewModel.phone,
        extension: source.contactsViewModel.extension,
        email: source.contactsViewModel.email,
        requestAssignees,
        lstAttachments: source.contactsViewModel.lstAttachments.map((attachment: AttachmentData) => {
          const att = {
            ...attachment,
          };
          delete att.total;
          delete att.loaded;
          return att;
        }),
        dataRequestContacts,
      } as RequestData,
    } as Envelope;
    const businessObjects = config.businessContext.businessObjects;
    const businessId = config.businessContext.businessId;
    envelope.businessObjects = businessObjects;
    envelope.businessId = businessId;
    return envelope;
  };
}
