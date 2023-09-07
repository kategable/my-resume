import { InternalUserData } from '../../api/envelope/envelope.api.interface';
import { Staffs } from '../../service/config/config.interface';
import { REGULATORY_INQUIRIES } from '../constants/envelope.constants';

export const internalStaffsMapper = (user: Staffs): InternalUserData => {
  const contact = {
    email: user.email,
    name: user.fullName,
    group: REGULATORY_INQUIRIES,
    required: true,
  };
  return contact as InternalUserData;
};
