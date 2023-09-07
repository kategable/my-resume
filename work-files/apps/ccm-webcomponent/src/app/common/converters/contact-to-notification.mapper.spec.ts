import { contactToNotificationMapper } from './contact-to-notification.mapper';
import { Contacts } from '../../service/config/config.interface';

//add tests from contact-to-notification.mapper.ts
describe('contact-to-notification.mapper.ts', () => {
  it('should map data', () => {
    const source = { businessEmail: ['email'] } as Contacts;

    const result = contactToNotificationMapper(source);

    expect(result.email).toEqual('email');
    expect(result.identityProvider).toEqual('EWS');
    expect(result.orgId).toEqual(-2);
    expect(result.id).toBeNull();
    expect(result.userId).toBeNull();
    expect(result.firstName).toBeNull();
    expect(result.lastName).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.phoneExt).toBeNull();
    expect(result.orgClass).toBeNull();
    expect(result.group).toBeNull();
  });
});
