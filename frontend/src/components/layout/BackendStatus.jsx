import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { checkHealth } from '../../services/task.service';

const POLL_INTERVAL_MS = 60000;

export const BackendStatus = () => {
  const [state, setState] = useState({ status: 'checking', message: 'Checking…' });

  useEffect(() => {
    let cancelled = false;

    const runCheck = async () => {
      try {
        const health = await checkHealth();

        if (!cancelled) {
          setState({ status: 'online', message: health?.status === 'ok' ? 'Backend online' : 'Backend reachable' });
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'offline', message: 'Backend unreachable' });
        }
      }
    };

    runCheck();
    const timer = setInterval(runCheck, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const toneClass = {
    checking: 'text-slate-400',
    online: 'text-emerald-400',
    offline: 'text-rose-400',
  }[state.status];

  const Icon = state.status === 'online' ? CheckCircle2 : state.status === 'offline' ? XCircle : Activity;

  return (
    <div className={`inline-flex items-center gap-2 text-xs font-medium ${toneClass}`} title={state.message}>
      <Icon className="size-4" aria-hidden="true" />
      <span>{state.message}</span>
    </div>
  );
};
