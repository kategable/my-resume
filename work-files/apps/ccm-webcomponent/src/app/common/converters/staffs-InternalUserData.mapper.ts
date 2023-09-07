import { ExternalUserData, InternalUserData } from '../../api/envelope/envelope.api.interface';
import { Staffs } from '../../service/config/config.interface';

export const staffsMapper = (user: InternalUserData | ExternalUserData): Staffs => {
  const staffs: Staffs = {
    userId: user.id + '',
    fullName: user.name,
    role: '',
    primaryFlag: false,
    email: user.email,
  };
  return staffs;
};
