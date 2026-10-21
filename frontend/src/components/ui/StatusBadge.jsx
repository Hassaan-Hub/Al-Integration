import { Badge } from './Badge';
import { getStatusMeta } from '../../utils/task';

export const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);

  return (
    <Badge className={meta.badgeClass} dotClass={meta.dotClass}>
      {meta.label}
    </Badge>
  );
};
