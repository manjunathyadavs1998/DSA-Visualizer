import type { GraphSpec } from '@/data/graphData';
import DataTreePanel from './DataTreePanel';
import DataGraphPanel from './DataGraphPanel';
import PanelToggle from '../PanelToggle';

/** Side panel showing the problem's input data structure (tree / graph),
 *  lit up live as the trace walks it. */
export default function StructurePanel({
  trees,
  graph,
  current,
  done,
  frontier,
  collapsed = false,
  onToggle,
}: {
  trees: { name: string; label: string; values: number[] }[];
  graph: GraphSpec | null;
  current: number | null;
  done: Set<number>;
  frontier: Set<number>;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pk pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            Input {graph ? 'Graph' : 'Tree'}
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
        <div className="min-h-0 flex-1 overflow-auto p-3">
          <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[8.5px] uppercase tracking-[0.14em] text-t4">
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-am" /> current</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-cy" /> queued</span>
            <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-gr" /> processed</span>
          </div>
          <div className="flex flex-col gap-4">
            {trees.map((t) => (
              <DataTreePanel
                key={t.name}
                label={t.label}
                values={t.values}
                current={current}
                done={done}
                frontier={frontier}
              />
            ))}
            {graph && (
              <DataGraphPanel data={graph} current={current} done={done} frontier={frontier} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
