import { Staffs } from '../../service/config/config.interface';
import { staffToNotificationMapper } from './staff-to-notification.mapper';

describe('staff-to-notification.mapper.ts', () => {
  it('should map data', () => {
    const source = { email: 'email', userId: 'test-usr' } as Staffs;

    const result = staffToNotificationMapper(source);

    expect(result.email).toEqual('email');
    expect(result.identityProvider).toEqual('ISSO');
    expect(result.orgId).toEqual(1);
    expect(result.id).toBeNull();
    expect(result.userId).toEqual('test-usr');
    expect(result.firstName).toBeNull();
    expect(result.lastName).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.phoneExt).toBeNull();
    expect(result.orgClass).toBeNull();
    expect(result.group).toBeNull();
  });
});
