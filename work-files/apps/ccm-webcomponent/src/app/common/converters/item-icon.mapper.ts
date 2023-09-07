import { ItemData } from '../../api/envelope/envelope.api.interface';
import { statusIconsMap } from '../constants/status-icons';

export const itemIconMapper = (item: ItemData): string => {
  return (statusIconsMap as any)[item.status?.replace(' ', '') || ''];
};
