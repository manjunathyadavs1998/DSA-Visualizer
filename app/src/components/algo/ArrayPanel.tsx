import type { DerivedState } from '@/engine/types';

/* Mark colors follow the app semantics: amber = focus/current, cyan = window,
   green = good, pink = bad, done = faded. */
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
// later marks win over earlier ones for the same cell
const PRIORITY = ['done', 'window', 'good', 'bad', 'focus'];

const LEGEND: [string, string][] = [
  ['var(--c-am)', 'focus'],
  ['var(--c-cy)', 'window'],
  ['var(--c-gr)', 'good'],
  ['var(--c-pk)', 'bad'],
];

export default function ArrayPanel({ state, stage = false }: { state: DerivedState; stage?: boolean }) {
  const { arr, ptrs, marks } = state;

  const cellStyle = (i: number): React.CSSProperties => {
    let style: React.CSSProperties = {};
    for (const kind of PRIORITY) if (marks[kind]?.includes(i)) style = { ...style, ...MARK_STYLE[kind] };
    return style;
  };
  // group pointer names by index for the badge rows under the cells
  const byIndex = new Map<number, string[]>();
  for (const [name, idx] of Object.entries(ptrs)) {
    if (idx < 0 || idx > arr.length) continue;
    byIndex.set(idx, [...(byIndex.get(idx) ?? []), name]);
  }

  const slot = (v: string, i: number, dashed = false) => (
    <div key={`s${i}`} className="flex flex-col items-center gap-1">
      <div
        key={v}
        className={`viz-pop flex h-10 min-w-10 items-center justify-center border px-1.5 font-mono text-[12px] text-t2 transition-all duration-150 ${
          dashed ? 'border-dashed border-line text-t5' : 'border-line bg-panel'
        }`}
        style={dashed ? undefined : cellStyle(i)}
      >
        {v}
      </div>
      <div className="font-mono text-[8px] text-t5">{i}</div>
      <div className="flex min-h-4 flex-col items-center gap-0.5">
        {(byIndex.get(i) ?? []).map((name) => (
          <span
            key={name}
            className="px-1 py-px font-mono text-[9px] font-bold leading-tight"
            style={{ background: 'var(--c-cy)', color: '#fff' }}
          >
            ↑{name}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`relative h-full overflow-auto ${stage ? 'flex items-center justify-center p-6' : 'p-3'}`}>
      {stage && (
        <div className="pointer-events-none absolute left-4 top-3 z-10 flex flex-col gap-1.5 text-[9px] uppercase tracking-[0.18em] text-t3">
          {LEGEND.map(([c, label]) => (
            <span key={label} className="flex items-center gap-1.5">
              <i className="inline-block h-2 w-2 rounded-full" style={{ background: c }} /> {label}
            </span>
          ))}
        </div>
      )}
      {!arr.length ? (
        <p className="p-4 text-[10px] uppercase tracking-[0.18em] text-t4">no array to show</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {arr.map((v, i) => slot(String(v), i))}
          {byIndex.has(arr.length) && slot('·', arr.length, true)}
        </div>
      )}
    </div>
  );
}
