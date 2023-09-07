// https://wiki.finra.org/display/RM/RM+Statuses
export enum EnvelopeStatus {
  DRAFT = 'Draft',
  OPEN = 'Open',
  SUBMITTED = 'Submitted',
  RE_OPENED = 'Re-Opened',
  ACCEPTED = 'Accepted',
  WITHDRAWN = 'Withdrawn',
  NO_RESPONSE = 'No Response',
  PUBLISHED = 'Published', // i.e. unknown
}

export default EnvelopeStatus;
