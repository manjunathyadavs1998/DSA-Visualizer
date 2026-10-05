import type { Problem, TraceStep } from '@/types/trace';
import PanelToggle from './PanelToggle';

export default function ComplexityPanel({
  problem,
  step,
  stepIndex,
  total,
  collapsed = false,
  onToggle,
}: {
  problem: Problem;
  step: TraceStep;
  stepIndex: number;
  total: number;
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
            Complexity · Live Metrics
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-1.5">
          <div className="border border-line bg-panel px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.2em] text-t4">time</p>
            <p className="mt-0.5 font-mono text-[15px] text-cy">{problem.time}</p>
          </div>
          <div className="border border-line bg-panel px-2.5 py-2">
            <p className="text-[9px] uppercase tracking-[0.2em] text-t4">stack space</p>
            <p className="mt-0.5 font-mono text-[15px] text-pu">{problem.space}</p>
          </div>
        </div>
        <div className="mt-1.5 border border-line bg-panel px-2.5 py-2">
          <p className="text-[9px] uppercase tracking-[0.2em] text-t4">recurrence</p>
          <p className="mt-0.5 font-mono text-[11.5px] text-t2">{problem.recurrence}</p>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="border border-line px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-t4">calls</p>
            <p className="font-mono text-[14px] text-t1">{step.calls}</p>
          </div>
          <div className="border border-line px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-t4">depth</p>
            <p className="font-mono text-[14px] text-t1">{step.depth}</p>
          </div>
          <div className="border border-line px-2 py-1.5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-t4">peak</p>
            <p className="font-mono text-[14px] text-am">{step.maxDepth}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[9px] uppercase tracking-[0.18em] text-t4">
            <span>execution progress</span>
            <span className="font-mono">
              {stepIndex} / {total - 1} steps
            </span>
          </div>
          <div className="h-1 w-full bg-panel2">
            <div
              className="h-full bg-cy transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
