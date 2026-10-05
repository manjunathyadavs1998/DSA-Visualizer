import type { SolutionDef } from '@/engine/types';

/** Dynamic input form generated from a solution's InputSpec list.
 *  Edits are drafts; Enter / blur / Run applies them (parse + clamp happens upstream). */
export default function AlgoInputs({
  def,
  draft,
  onDraft,
  onApply,
  onRun,
}: {
  def: SolutionDef;
  draft: Record<string, string>;
  onDraft: (name: string, text: string) => void;
  /** Silent apply (blur) — re-trace only if changed. */
  onApply: () => void;
  /** ▶ run — always restarts from step 0 and autoplays. */
  onRun: () => void;
}) {
  if (!def.inputs.length) return null;
  return (
    <div className="mt-3 border border-line bg-ink px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-t4">inputs</span>
        <button
          onClick={onRun}
          title="Restart the dry run with these inputs"
          className="border border-cy/40 bg-cy/10 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-cy transition-colors hover:bg-cy/20"
        >
          ▶ run
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {def.inputs.map((spec) => (
          <label key={spec.name} className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate text-[10.5px] uppercase tracking-[0.08em] text-t4">
              {spec.label}
            </span>
            <input
              type="text"
              value={draft[spec.name] ?? ''}
              onChange={(e) => onDraft(spec.name, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRun();
              }}
              onBlur={onApply}
              spellCheck={false}
              className="w-full min-w-0 border border-line bg-panel px-2.5 py-1.5 font-mono text-[12.5px] text-am outline-none transition-colors focus:border-cy/50"
            />
            <span className="shrink-0 font-mono text-[9.5px] text-t5">
              {spec.kind === 'number'
                ? `${spec.min}–${spec.max}`
                : spec.kind === 'numbers'
                  ? `≤${spec.maxLen} nums`
                  : `≤${spec.maxLen} chars`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
