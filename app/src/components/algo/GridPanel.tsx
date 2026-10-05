import type { DerivedState } from '@/engine/types';

const MARK_STYLE: Record<string, React.CSSProperties> = {
  window: {
    background: 'color-mix(in srgb, var(--c-cy) 10%, transparent)',
    borderColor: 'var(--c-cy)',
  },
  focus: {
    background: 'color-mix(in srgb, var(--c-am) 15%, transparent)',
    borderColor: 'var(--c-am)',
    boxShadow: '0 0 0 1.5px var(--c-am)',
  },
  good: {
    background: 'color-mix(in srgb, var(--c-gr) 12%, transparent)',
    borderColor: 'var(--c-gr)',
  },
  bad: {
    background: 'color-mix(in srgb, var(--c-pk) 12%, transparent)',
    borderColor: 'var(--c-pk)',
  },
  done: { opacity: 0.4 },
};
const PRIORITY = ['done', 'window', 'good', 'bad', 'focus'];

export default function GridPanel({ state, stage = false }: { state: DerivedState; stage?: boolean }) {
  const { grid, gptrs, gmarks } = state;
  if (!grid.length)
    return <p className="p-4 text-[10px] uppercase tracking-[0.18em] text-t4">no grid to show</p>;
  const cols = Math.max(...grid.map((r) => r.length));

  const cellStyle = (r: number, c: number): React.CSSProperties => {
    let style: React.CSSProperties = {};
    for (const kind of PRIORITY)
      if (gmarks[kind]?.some(([rr, cc]) => rr === r && cc === c)) style = { ...style, ...MARK_STYLE[kind] };
    return style;
  };
  // pointer badges: on-cell, row-header (c === -1), column-header (r === -1)
  const cellPtrs = (r: number, c: number) =>
    Object.entries(gptrs).filter(([, [rr, cc]]) => rr === r && cc === c).map(([n]) => n);
  const rowPtrs = (r: number) =>
    Object.entries(gptrs).filter(([, [rr, cc]]) => rr === r && cc === -1).map(([n]) => n);
  const colPtrs = (c: number) =>
    Object.entries(gptrs).filter(([, [rr, cc]]) => rr === -1 && cc === c).map(([n]) => n);
  // crosshair: tint the row + column of every on-cell pointer
  const hotRows = new Set<number>();
  const hotCols = new Set<number>();
  for (const [, [r, c]] of Object.entries(gptrs)) {
    if (r >= 0 && c >= 0) {
      hotRows.add(r);
      hotCols.add(c);
    }
    if (c === -1 && r >= 0) hotRows.add(r);
    if (r === -1 && c >= 0) hotCols.add(c);
  }

  const badge = (n: string) => (
    <span
      key={n}
      className="px-1 py-px font-mono text-[9px] font-bold leading-tight"
      style={{ background: 'var(--c-cy)', color: '#fff' }}
    >
      {n}
    </span>
  );
  const headBase: React.CSSProperties = { minWidth: 40, height: 26 };
  const hotHead = { background: 'color-mix(in srgb, var(--c-cy) 12%, transparent)' };

  return (
    <div className={`h-full overflow-auto ${stage ? 'flex items-center justify-center p-6' : 'p-3'}`}>
      <table className="border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="text-[9px] font-normal text-t5" style={headBase}>
              r \ c
            </th>
            {Array.from({ length: cols }, (_, c) => (
              <th
                key={c}
                style={{ ...headBase, ...(hotCols.has(c) ? hotHead : {}) }}
                className="font-mono text-[10px] font-medium text-t4"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span>{c}</span>
                  <span className="flex gap-0.5">{colPtrs(c).map(badge)}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              <th
                style={{ ...headBase, ...(hotRows.has(r) ? hotHead : {}) }}
                className="font-mono text-[10px] font-medium text-t4"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{r}</span>
                  <span className="flex gap-0.5">{rowPtrs(r).map(badge)}</span>
                </div>
              </th>
              {Array.from({ length: cols }, (_, c) => {
                const inCross = hotRows.has(r) || hotCols.has(c);
                const ptrsHere = cellPtrs(r, c);
                return (
                  <td
                    key={c}
                    className="border text-center font-mono text-[12px] text-t2 transition-all duration-150"
                    style={{
                      minWidth: 40,
                      height: 36,
                      background: inCross
                        ? 'color-mix(in srgb, var(--c-cy) 6%, var(--c-panel))'
                        : 'var(--c-panel)',
                      borderColor: 'var(--c-line)',
                      ...cellStyle(r, c),
                    }}
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span key={String(row[c])} className="viz-pop inline-block">
                        {row[c] !== undefined ? String(row[c]) : ''}
                      </span>
                      {ptrsHere.length > 0 && <span className="flex gap-0.5">{ptrsHere.map(badge)}</span>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
