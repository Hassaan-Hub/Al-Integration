import { Badge } from './Badge';
import { getPriorityMeta } from '../../utils/task';

export const PriorityBadge = ({ priority }) => {
  const meta = getPriorityMeta(priority);

  return (
    <Badge className={meta.badgeClass} dotClass={meta.dotClass}>
      {meta.label} priority
    </Badge>
  );
};
