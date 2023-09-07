import { RequestTemplate } from '../../api/envelope/envelope.api.interface';

export const emailSubjectMapper = (
  template?: RequestTemplate | null,
  firmName: string = '',
  caseId: string = ''
): string => {
  const subjectMessage = template?.messages?.subjectMessage;
  let eSubject = subjectMessage
    ? subjectMessage
        .replace('{{target.name}}', firmName)
        .replace('{{requestTemplate.name}}', template.name)
        .replace('{{caseId}}', caseId)
    : '';
  if (eSubject.trimStart().startsWith(':')) {
    eSubject = eSubject.trimStart().substring(1);
  }
  return eSubject.trim();
};
