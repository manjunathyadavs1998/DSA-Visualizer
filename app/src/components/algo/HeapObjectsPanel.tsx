import type { DerivedState } from '@/engine/types';
import { fmt } from '@/engine/tracer';
import PanelToggle from '../PanelToggle';

/** Stable fake address per object name — teaches "frames hold references into the heap". */
function addr(name: string): string {
  let h = 7;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
  return '0x' + (0x7f00 + (h % 0x7ff) * 16).toString(16).toUpperCase();
}

function kindOf(v: unknown): string {
  if (Array.isArray(v)) return v.some(Array.isArray) ? 'List<List>' : 'List';
  if (v !== null && typeof v === 'object') return 'Map';
  return typeof v;
}

const CHIP = 'border border-line bg-panel px-1.5 py-px font-mono text-[10px] text-t2';

function Value({ v }: { v: unknown }) {
  if (Array.isArray(v)) {
    if (!v.length) return <span className="font-mono text-[10px] text-t4">[] empty</span>;
    return (
      <span className="flex flex-wrap gap-1">
        {v.map((x, i) => (
          <span key={i} className={CHIP}>
            {Array.isArray(x) ? `[${x.join(',')}]` : String(x)}
          </span>
        ))}
      </span>
    );
  }
  if (v !== null && typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>);
    if (!entries.length) return <span className="font-mono text-[10px] text-t4">{'{} empty'}</span>;
    return (
      <span className="flex flex-wrap gap-1">
        {entries.map(([k, x]) => (
          <span key={k} className={CHIP}>
            {k}:{fmt(x)}
          </span>
        ))}
      </span>
    );
  }
  return <span className="font-mono text-[10px] text-t2">{fmt(v)}</span>;
}

export default function HeapObjectsPanel({
  state,
  memoEntries,
  collapsed = false,
  onToggle,
}: {
  state: DerivedState;
  memoEntries: number;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  const objects = Object.entries(state.heap);
  const memoTouched = state.lastSet !== null || state.lastHit !== null;

  const card = (changed: boolean): React.CSSProperties => ({
    borderColor: changed ? 'var(--c-pu)' : 'var(--c-line)',
    background: changed ? 'color-mix(in srgb, var(--c-pu) 8%, transparent)' : 'transparent',
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gr pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Heap / Memory
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
        <div className="flex-1 overflow-y-auto p-2.5">
          {!objects.length && !memoEntries ? (
            <div className="flex h-full items-center justify-center border border-dashed border-line">
              <p className="px-3 text-center text-[10px] uppercase tracking-[0.18em] text-t4">
                heap empty — objects appear as the run allocates them
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {objects.map(([name, v]) => {
                const changed = state.lastHeap.includes(name);
                return (
                  <div
                    key={name}
                    className={`border px-2.5 py-1.5 transition-all duration-200 ${changed ? 'viz-pop' : ''}`}
                    style={card(changed)}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[11px] font-bold text-t1">{name}</span>
                      <span className="bg-panel2 px-1 py-px text-[8px] font-semibold uppercase tracking-wide text-t4">
                        {kindOf(v)}
                      </span>
                      <span className="ml-auto font-mono text-[9px] text-t5">{addr(name)}</span>
                      {changed && (
                        <span className="text-[8px] font-bold uppercase tracking-wide text-pu">
                          updated
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <Value v={v} />
                    </div>
                  </div>
                );
              })}

              {memoEntries > 0 && (
                <div className="border px-2.5 py-1.5 transition-all duration-200" style={card(memoTouched)}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] font-bold text-t1">memo</span>
                    <span className="bg-panel2 px-1 py-px text-[8px] font-semibold uppercase tracking-wide text-t4">
                      Map
                    </span>
                    <span className="ml-auto font-mono text-[9px] text-t5">{addr('memo')}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-t4">
                    {memoEntries} {memoEntries === 1 ? 'entry' : 'entries'} — contents in the DP table
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
