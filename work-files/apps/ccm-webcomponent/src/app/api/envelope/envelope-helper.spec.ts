import { formatDateWithTime, formatItemDates, usDate2yyyymmdd, yyyymmdd2UsDate } from './envelope-helper';
import { RequestTemplate } from './envelope.api.interface';
import { emailSubjectMapper } from '../../common/converters/email-subject.mapper';

describe('EnvelopeHelper', () => {
  it('should return envelope with subject and notification message', () => {
    const requestTemplate: RequestTemplate = {
      id: '105',
      name: 'ETP Surveillance and Investigations',
      description:
        'The ETP Surveillance and Investigations Request is used to request a series of records in support of ETP Surveillance and Investigations.',
      messages: { subjectMessage: '{{target.name}} : {{requestTemplate.name}}' },
    };
    const subject = emailSubjectMapper(requestTemplate, 'Firm Name');

    expect(subject).toEqual('Firm Name : ETP Surveillance and Investigations');
    //expect(envelope.draftPayload.notificationMsg).toEqual(requestTemplate.description);
  });
  it('should return envelope with subject and notification message with firm and case', () => {
    const requestTemplate: RequestTemplate = {
      id: '105',
      name: 'ETP Surveillance and Investigations',
      description:
        'The ETP Surveillance and Investigations Request is used to request a series of records in support of ETP Surveillance and Investigations.',
      messages: { subjectMessage: '{{target.name}} : {{requestTemplate.name}} : {{caseId}}' },
    };
    const subject = emailSubjectMapper(requestTemplate, 'Firm Name', 'Case Id123');

    expect(subject).toEqual('Firm Name : ETP Surveillance and Investigations : Case Id123');
    //expect(envelope.draftPayload.notificationMsg).toEqual(requestTemplate.description);
  });
  it('should return envelope with subject and notification message when no firm name is specified', () => {
    const requestTemplate: RequestTemplate = {
      id: '105',
      name: 'ETP Surveillance and Investigations',
      description:
        'The ETP Surveillance and Investigations Request is used to request a series of records in support of ETP Surveillance and Investigations.',
      messages: { subjectMessage: '{{target.name}} : {{requestTemplate.name}}' },
    };
    const subject = emailSubjectMapper(requestTemplate);

    expect(subject).toEqual('ETP Surveillance and Investigations');
    //expect(envelope.draftPayload.notificationMsg).toEqual(requestTemplate.description);
  });
  it('should return envelope without subject and notification message', () => {
    const subject = emailSubjectMapper();
    expect(subject).toEqual('');
    //expect(envelope.draftPayload.notificationMsg).toEqual("");
  });

  it('yyyymmdd2UsDate', () => {
    expect(yyyymmdd2UsDate('20230815')).toEqual('08/15/2023');
    expect(yyyymmdd2UsDate('202308150')).toEqual('');
    expect(yyyymmdd2UsDate('YY230815')).toEqual('');
  });

  it('usDate2yyyymmdd', () => {
    expect(usDate2yyyymmdd('08/15/2023')).toEqual('20230815');
    expect(usDate2yyyymmdd('8/1/2023')).toEqual('20230801');
    expect(usDate2yyyymmdd(null)).toEqual(null);
    expect(usDate2yyyymmdd('08/1502023')).toEqual(null);
  });

  it('formatDateWithTime', () => {
    expect(formatDateWithTime(null)).toEqual(null);
    const jsDate = 'Aug 15 2023 17:55:43 GMT-0400';
    const formatted = '08/15/2023 17:55:43 -0400';
    expect(formatDateWithTime(jsDate)).toEqual(formatted);
  });

  it('formatDateWithTime with invalid date', () => {
    expect(formatDateWithTime(null)).toEqual(null);
    const jsDate = 'asd';
    const formatted = 'asd';
    expect(formatDateWithTime(jsDate)).toEqual(formatted);
  });

  it('formatItemDates', () => {
    expect(formatItemDates(null)).toEqual('');
  });
});
