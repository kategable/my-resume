import { InternalUserData } from '../../api/envelope/envelope.api.interface';
import { Staffs } from '../../service/config/config.interface';
import { staffsToUserMapper } from './staffs-to-user.mapper';

describe('staffsToUserMapper', () => {
  it('should return null if user is null', () => {
    expect(staffsToUserMapper(null)).toBeNull();
  });
  it('should return contact if user is not null', () => {
    const user: Staffs = {
      userId: '1',
      fullName: 'John Doe',
      role: '',
      primaryFlag: false,
      email: 'test',
    };
    const contact: InternalUserData = {
      identityProvider: 'isso',
      id: '1',
    } as any;
    expect(staffsToUserMapper(user)).toEqual(contact);
  });
});
