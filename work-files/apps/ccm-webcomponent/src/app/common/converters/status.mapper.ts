import EnvelopeStatus from '../../firm-request/enums/envelope-status';

export const statusMapper = (envelopeStatus: string | undefined): EnvelopeStatus => {
  envelopeStatus = envelopeStatus?.toLocaleLowerCase().trim();
  switch (envelopeStatus) {
    case undefined:
    case 'draft':
      return EnvelopeStatus.DRAFT;
    case 'open':
      return EnvelopeStatus.OPEN;
    case 'submitted':
      return EnvelopeStatus.SUBMITTED;
    case 're-opened':
      return EnvelopeStatus.RE_OPENED;
    case 'accepted':
      return EnvelopeStatus.ACCEPTED;
    case 'withdrawn':
      return EnvelopeStatus.WITHDRAWN;
    case 'no response':
      return EnvelopeStatus.NO_RESPONSE;
    case 'submitted':
      return EnvelopeStatus.SUBMITTED;
    case 'published':
    default:
      return EnvelopeStatus.PUBLISHED;
  }
};
