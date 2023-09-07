import { InternalUserData } from '../../api/envelope/envelope.api.interface';
import { Staffs } from '../../service/config/config.interface';

export const staffsToUserMapper = (user: Staffs | null): InternalUserData | null => {
  if (!user) return null;
  const contact = {
    identityProvider: 'isso',
    id: user.userId,
  };
  return contact as InternalUserData;
};
