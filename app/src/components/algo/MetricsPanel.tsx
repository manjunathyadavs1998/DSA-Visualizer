import { fmt } from '@/engine/tracer';
import PanelToggle from '../PanelToggle';

export default function MetricsPanel({
  entry,
  calls,
  result,
  truncated,
  stepIndex,
  total,
  time,
  space,
  collapsed = false,
  onToggle,
}: {
  entry: string;
  calls: number;
  result: unknown;
  truncated: boolean;
  stepIndex: number;
  total: number;
  time?: string;
  space?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const pct = total <= 1 ? 0 : (stepIndex / (total - 1)) * 100;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-am pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Run · Live Metrics
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
        <div className="flex-1 overflow-y-auto p-3">
          {(time || space) && (
            <div className="mb-1.5 grid grid-cols-2 gap-1.5">
              <div className="border border-line bg-panel px-2.5 py-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-t4">time</p>
                <p className="mt-0.5 font-mono text-[15px] text-cy">{time ?? '—'}</p>
              </div>
              <div className="border border-line bg-panel px-2.5 py-2">
                <p className="text-[9px] uppercase tracking-[0.2em] text-t4">space</p>
                <p className="mt-0.5 font-mono text-[15px] text-pu">{space ?? '—'}</p>
              </div>
            </div>
          )}
          <div className="border border-line bg-panel px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.2em] text-t4">entry call</p>
            <p className="mt-0.5 truncate font-mono text-[12px] text-cy">{entry}</p>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <div className="border border-line px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-t4">calls</p>
              <p className="font-mono text-[14px] text-t1">{calls}</p>
            </div>
            <div className="border border-line px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-t4">result</p>
              <p className="truncate font-mono text-[14px] text-gr">{fmt(result)}</p>
            </div>
          </div>
          {truncated && (
            <p className="mt-1.5 border border-am/40 bg-am/10 px-2 py-1 text-[9.5px] text-am">
              trace capped at 3000 calls — shrink the inputs for a full run
            </p>
          )}
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[9px] uppercase tracking-[0.18em] text-t4">
              <span>execution progress</span>
              <span className="font-mono">
                {stepIndex} / {total - 1} steps
              </span>
            </div>
            <div className="h-1 w-full bg-panel2">
              <div className="h-full bg-cy transition-all duration-200" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
