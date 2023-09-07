import { Firm } from '../../api/envelope/envelope.api.interface';
import { Contacts } from '../../service/config/config.interface';

export const selectedFirmMapper = (firm: Contacts | null): Firm[] => {
  let lstFirmData: Firm[] = [];
  if (!firm) return lstFirmData;
  lstFirmData = [
    {
      id: firm.crdId,
      name: firm.name,
    },
  ];
  return lstFirmData || [];
};
