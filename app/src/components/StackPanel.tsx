import type { StackFrame } from '@/types/trace';
import PanelToggle from './PanelToggle';

export default function StackPanel({
  stack,
  collapsed = false,
  onToggle,
}: {
  stack: StackFrame[];
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const shown = [...stack].reverse(); // top of stack first
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cy pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Call Stack
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-wider text-t4">
            depth {stack.length}
          </span>
          <PanelToggle collapsed={collapsed} onToggle={onToggle} />
        </div>
      </div>
      {collapsed ? null : (
      <div className="flex-1 overflow-y-auto p-2.5">
        {shown.length === 0 ? (
          <div className="flex h-full items-center justify-center border border-dashed border-line">
            <p className="px-3 text-center text-[10px] uppercase tracking-[0.18em] text-t4">
              stack empty
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {shown.map((f, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={f.id}
                  className={`frame-in border px-2.5 py-1.5 ${
                    isTop ? 'border-am/50 bg-am/10' : 'border-cy/25 bg-cy/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`truncate font-mono text-[11px] ${
                        isTop ? 'text-amt' : 'text-cyt'
                      }`}
                    >
                      {f.name}
                    </span>
                    {isTop && (
                      <span className="shrink-0 border border-am/40 px-1 text-[9px] uppercase tracking-[0.2em] text-am">
                        top
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {f.locals.map((l) => (
                      <span key={l.k} className="font-mono text-[9.5px] text-t3">
                        {l.k} = <span className="text-t2">{l.v}</span>
                      </span>
                    ))}
                  </div>
                  {f.line >= 0 && (
                    <div className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-t5">
                      paused at line {f.line + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}
    </div>
  );
}
