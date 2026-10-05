import type { DerivedState } from '@/engine/types';
import { fmt as fmtRaw } from '@/engine/tracer';
import PanelToggle from '../PanelToggle';

// board cells store plain chars — show them unquoted
const fmt = (v: unknown) =>
  typeof v === 'string' ? (v.length > 12 ? v.slice(0, 11) + '…' : v) : fmtRaw(v);

const TD =
  'border border-line text-center min-w-9 h-7 px-1.5 font-mono text-[11px] text-t2 transition-colors duration-200';
const TH = TD + ' bg-panel2 text-t4 font-medium';

function DpTable({ allKeys, state }: { allKeys: string[]; state: DerivedState }) {
  if (!allKeys.length) return null;
  const is2D = allKeys.every((k) => /^-?\d+,-?\d+$/.test(k));
  const is1D = !is2D && allKeys.every((k) => /^-?\d+$/.test(k));
  const cls = (k: string) =>
    k === state.lastHit ? 'hit' : k === state.lastSet ? 'just' : k in state.memo ? 'set' : '';
  const style = (k: string): React.CSSProperties => {
    const c = cls(k);
    if (c === 'hit')
      return {
        background: 'color-mix(in srgb, var(--c-cy) 12%, transparent)',
        outline: '1.5px solid var(--c-cy)',
      };
    if (c === 'just')
      return {
        background: 'color-mix(in srgb, var(--c-pu) 14%, transparent)',
        outline: '1.5px solid var(--c-pu)',
      };
    if (c === 'set') return { background: 'color-mix(in srgb, var(--c-gr) 10%, transparent)' };
    return {};
  };
  const popCls = (k: string) => {
    const c = cls(k);
    return c === 'just' || c === 'hit' ? ' viz-pop' : '';
  };

  if (is2D) {
    const rows = Math.max(...allKeys.map((k) => +k.split(',')[0])) + 1;
    const cols = Math.max(...allKeys.map((k) => +k.split(',')[1])) + 1;
    return (
      <table className="border-collapse">
        <thead>
          <tr>
            <th className={TH}>i \ j</th>
            {Array.from({ length: cols }, (_, j) => (
              <th key={j} className={TH}>
                {j}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, i) => (
            <tr key={i}>
              <th className={TH}>{i}</th>
              {Array.from({ length: cols }, (_, j) => {
                const k = `${i},${j}`;
                return (
                  <td key={j} className={TD + popCls(k)} style={style(k)}>
                    {k in state.memo ? fmt(state.memo[k]) : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (is1D) {
    const max = Math.max(...allKeys.map(Number));
    return (
      <table className="border-collapse">
        <thead>
          <tr>
            <th className={TH}>key</th>
            {Array.from({ length: max + 1 }, (_, i) => (
              <th key={i} className={TH}>
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th className={TH}>value</th>
            {Array.from({ length: max + 1 }, (_, i) => (
              <td key={i} className={TD + popCls(String(i))} style={style(String(i))}>
                {String(i) in state.memo ? fmt(state.memo[String(i)]) : ''}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(state.memo).map(([k, v]) => (
        <span
          key={k}
          className={
            'border border-line px-2 py-0.5 font-mono text-[11px] text-t2 transition-colors duration-200' +
            popCls(k)
          }
          style={style(k)}
        >
          {k} → {fmt(v)}
        </span>
      ))}
    </div>
  );
}

export default function MemoPanel({
  allKeys,
  state,
  collapsed = false,
  onToggle,
}: {
  allKeys: string[];
  state: DerivedState;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pu pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            DP / Memo Table
          </span>
          <span className="font-mono text-[10px] tracking-wider text-t4">
            {Object.keys(state.memo).length}/{allKeys.length}
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
        <div className="flex-1 overflow-auto p-3">
          <DpTable allKeys={allKeys} state={state} />
        </div>
      )}
    </div>
  );
}
