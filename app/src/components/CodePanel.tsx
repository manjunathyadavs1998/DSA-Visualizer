import { useEffect, useRef } from 'react';
import PanelToggle from './PanelToggle';

/** Simple Java-ish syntax tinting applied per token. */
function tint(line: string): React.ReactNode {
  const parts = line.split(/(\/\/.*$)/);
  return parts.map((part, pi) => {
    if (part.startsWith('//')) {
      return (
        <span key={pi} className="text-comment">
          {part}
        </span>
      );
    }
    const tokens = part.split(/(\b(?:int|void|if|else|return|char|new|null|Math)\b|\b\d+\b|"[^"]*")/g);
    return tokens.map((tok, ti) => {
      if (/^(int|void|if|else|return|char|new|null|Math)$/.test(tok))
        return <span key={`${pi}-${ti}`} className="text-pu">{tok}</span>;
      if (/^\d+$/.test(tok)) return <span key={`${pi}-${ti}`} className="text-am">{tok}</span>;
      return <span key={`${pi}-${ti}`}>{tok}</span>;
    });
  });
}

export default function CodePanel({
  code,
  currentLine,
  collapsed = false,
  onToggle,
  title = 'Pseudocode · Java style',
  onLineClick,
}: {
  code: string[];
  currentLine: number;
  collapsed?: boolean;
  onToggle?: () => void;
  title?: string;
  onLineClick?: (line: number) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLine < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-line="${currentLine}"]`);
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentLine]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-pu pulse-dot" />
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-t3">
            {title}
          </span>
        </div>
        <PanelToggle collapsed={collapsed} onToggle={onToggle} />
      </div>
      {collapsed ? null : (
      <div ref={listRef} className="flex-1 overflow-y-auto py-2 font-mono">
        {code.map((line, i) => {
          const active = i === currentLine;
          return (
            <div
              key={i}
              data-line={i}
              onClick={onLineClick ? () => onLineClick(i) : undefined}
              title={onLineClick ? 'Jump to the next step that executes this line' : undefined}
              className={`flex items-start gap-3 border-l-2 px-3 py-[3px] transition-colors duration-150 ${
                active ? 'border-am bg-am/10' : 'border-transparent'
              } ${onLineClick ? 'cursor-pointer hover:bg-panel2/60' : ''}`}
            >
              <span
                className={`w-4 shrink-0 select-none text-right text-[10px] leading-5 ${
                  active ? 'text-am' : 'text-t5'
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`w-3 shrink-0 select-none text-[10px] leading-5 text-am ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                ▶
              </span>
              <code
                className={`whitespace-pre text-[11.5px] leading-5 ${
                  active ? 'text-t1' : 'text-codedim'
                }`}
              >
                {tint(line)}
              </code>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
